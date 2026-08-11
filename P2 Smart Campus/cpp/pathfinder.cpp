/**
 * Smart Campus Navigation System
 * C++ Pathfinding Engine — Dijkstra's Shortest Path Algorithm
 *
 * Compile with Emscripten:
 *   em++ pathfinder.cpp -o pathfinder.js \
 *       -s WASM=1 \
 *       -s EXPORTED_FUNCTIONS='["_findPath","_initGraph","_addNode","_addEdge","_malloc","_free"]' \
 *       -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString"]' \
 *       -s MODULARIZE=1 \
 *       -s EXPORT_NAME="PathfinderModule"
 *
 * This module implements Dijkstra's algorithm on a weighted undirected graph.
 * The graph represents the campus: nodes are buildings/locations,
 * edges are walkable paths with distance (meters) as weights.
 */

#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <climits>
#include <sstream>
#include <string>
#include <algorithm>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define EXPORT
#endif

// ---------------------------------------------------------------------------
// Data Structures
// ---------------------------------------------------------------------------

struct Edge {
    int to;
    double weight; // distance in meters
};

struct Node {
    int id;
    std::string name;
    std::string type; // "building", "lab", "office", "facility", "junction"
    double x, y;     // SVG/map coordinates
};

// ---------------------------------------------------------------------------
// Graph Class
// ---------------------------------------------------------------------------

class CampusGraph {
public:
    int nodeCount = 0;
    std::unordered_map<int, std::vector<Edge>> adj;
    std::unordered_map<int, Node> nodes;

    void addNode(int id, const std::string& name, const std::string& type,
                 double x, double y) {
        nodes[id] = {id, name, type, x, y};
        nodeCount++;
    }

    void addEdge(int u, int v, double weight) {
        adj[u].push_back({v, weight});
        adj[v].push_back({u, weight}); // undirected
    }

    /**
     * Dijkstra's shortest path from 'start' to 'end'.
     * Returns vector of node IDs forming the shortest path.
     * Returns empty vector if no path exists.
     */
    std::vector<int> dijkstra(int start, int end) {
        // dist[id] = best known distance to node 'id'
        std::unordered_map<int, double> dist;
        std::unordered_map<int, int> prev;

        for (auto& kv : nodes) {
            int id = kv.first;
            dist[id] = std::numeric_limits<double>::infinity();
            prev[id] = -1;
        }
        dist[start] = 0.0;

        // Min-heap: (distance, nodeId)
        using pdi = std::pair<double, int>;
        std::priority_queue<pdi, std::vector<pdi>, std::greater<pdi>> pq;
        pq.push(std::make_pair(0.0, start));

        while (!pq.empty()) {
            pdi topVal = pq.top();
            double d = topVal.first;
            int u = topVal.second;
            pq.pop();

            if (d > dist[u]) continue; // stale entry

            if (u == end) break; // reached destination

            for (auto& edge : adj[u]) {
                double newDist = dist[u] + edge.weight;
                if (newDist < dist[edge.to]) {
                    dist[edge.to] = newDist;
                    prev[edge.to] = u;
                    pq.push(std::make_pair(newDist, edge.to));
                }
            }
        }

        // Reconstruct path
        std::vector<int> path;
        if (dist[end] == std::numeric_limits<double>::infinity()) {
            return path; // no path found
        }

        for (int cur = end; cur != -1; cur = prev[cur]) {
            path.push_back(cur);
        }
        std::reverse(path.begin(), path.end());
        return path;
    }

    double getDistance(int start, int end) {
        auto path = dijkstra(start, end);
        if (path.empty()) return -1.0;

        double total = 0.0;
        for (size_t i = 1; i < path.size(); i++) {
            int u = path[i-1], v = path[i];
            for (auto& e : adj[u]) {
                if (e.to == v) { total += e.weight; break; }
            }
        }
        return total;
    }
};

// ---------------------------------------------------------------------------
// Global graph instance
// ---------------------------------------------------------------------------

static CampusGraph g_graph;

// ---------------------------------------------------------------------------
// C API (exported to JavaScript via Emscripten)
// ---------------------------------------------------------------------------

extern "C" {

EXPORT void initGraph() {
    g_graph = CampusGraph();
}

EXPORT void addNode(int id, const char* name, const char* type,
                    double x, double y) {
    g_graph.addNode(id, std::string(name), std::string(type), x, y);
}

EXPORT void addEdge(int u, int v, double weight) {
    g_graph.addEdge(u, v, weight);
}

/**
 * findPath: returns JSON string of node IDs for shortest path.
 * e.g. "[1,5,8,12]"
 * Caller must free the returned string.
 */
EXPORT const char* findPath(int fromId, int toId) {
    auto path = g_graph.dijkstra(fromId, toId);
    std::ostringstream oss;
    oss << "[";
    for (size_t i = 0; i < path.size(); i++) {
        if (i > 0) oss << ",";
        oss << path[i];
    }
    oss << "]";

    std::string result = oss.str();
    char* buf = new char[result.size() + 1];
    std::copy(result.begin(), result.end(), buf);
    buf[result.size()] = '\0';
    return buf;
}

EXPORT double getTotalDistance(int fromId, int toId) {
    return g_graph.getDistance(fromId, toId);
}

} // extern "C"

// ---------------------------------------------------------------------------
// Standalone test (non-WASM build)
// ---------------------------------------------------------------------------

#ifndef __EMSCRIPTEN__
int main() {
    initGraph();

    // Sample campus nodes
    addNode(1, "Main Gate",       "junction",  100, 500);
    addNode(2, "Admin Block",     "building",  200, 350);
    addNode(3, "Library",         "facility",  400, 200);
    addNode(4, "CS Lab",          "lab",       600, 300);
    addNode(5, "Cafeteria",       "facility",  350, 450);
    addNode(6, "Auditorium",      "building",  600, 500);
    addNode(7, "Sports Ground",   "facility",  750, 600);
    addNode(8, "Hostel Block",    "building",  150, 700);
    addNode(9, "Medical Center",  "office",    450, 650);
    addNode(10,"Physics Lab",     "lab",       600, 150);

    // Campus paths
    addEdge(1, 2, 120);
    addEdge(1, 8, 100);
    addEdge(2, 3, 180);
    addEdge(2, 5, 90);
    addEdge(3, 4, 150);
    addEdge(3, 10, 120);
    addEdge(4, 6, 130);
    addEdge(4, 10, 80);
    addEdge(5, 6, 160);
    addEdge(5, 9, 110);
    addEdge(6, 7, 100);
    addEdge(7, 9, 140);
    addEdge(8, 9, 200);
    addEdge(9, 6, 120);

    // Test: Main Gate -> CS Lab
    const char* result = findPath(1, 4);
    std::cout << "Path from Main Gate to CS Lab: " << result << std::endl;

    double dist = getTotalDistance(1, 4);
    std::cout << "Distance: " << dist << " meters (~"
              << (int)(dist / 80) << " min walk)" << std::endl;

    delete[] result;
    return 0;
}
#endif

// Smart Campus Pathfinder Engine - System Build Verified


