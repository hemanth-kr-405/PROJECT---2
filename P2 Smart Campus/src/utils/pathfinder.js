/**
 * Smart Campus Navigation System
 * Pathfinder Utility — JavaScript implementation of Dijkstra's algorithm
 *
 * This is a 1:1 port of cpp/pathfinder.cpp to JavaScript.
 * It serves as:
 *   1. The primary pathfinding engine (when WASM is not available)
 *   2. A fallback while the WASM module loads
 *   3. A reference implementation for testing
 *
 * When the WASM module IS available (pathfinder.wasm compiled via Emscripten),
 * the wasmFindPath() function will be used instead for near-native performance.
 */

import { CAMPUS_NODES, CAMPUS_EDGES, NODE_MAP, WALKING_SPEED_MPS } from '../data/campusGraph.js';

// ---------------------------------------------------------------------------
// Graph Builder
// ---------------------------------------------------------------------------

function buildAdjacencyList(nodes, edges) {
  const adj = {};

  // Initialize all node entries
  for (const node of nodes) {
    adj[node.id] = [];
  }

  // Add edges (undirected)
  for (const edge of edges) {
    adj[edge.from].push({ to: edge.to,   weight: edge.weight });
    adj[edge.to].push  ({ to: edge.from, weight: edge.weight });
  }

  return adj;
}

// ---------------------------------------------------------------------------
// MinHeap (Priority Queue) — mirrors C++ std::priority_queue<pdi, ..., greater>
// ---------------------------------------------------------------------------

class MinHeap {
  constructor() { this._data = []; }

  push(item) {
    this._data.push(item);
    this._bubbleUp(this._data.length - 1);
  }

  pop() {
    const top = this._data[0];
    const last = this._data.pop();
    if (this._data.length > 0) {
      this._data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  get size() { return this._data.length; }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._data[parent][0] <= this._data[i][0]) break;
      [this._data[parent], this._data[i]] = [this._data[i], this._data[parent]];
      i = parent;
    }
  }

  _siftDown(i) {
    const n = this._data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._data[l][0] < this._data[smallest][0]) smallest = l;
      if (r < n && this._data[r][0] < this._data[smallest][0]) smallest = r;
      if (smallest === i) break;
      [this._data[smallest], this._data[i]] = [this._data[i], this._data[smallest]];
      i = smallest;
    }
  }
}

// ---------------------------------------------------------------------------
// Dijkstra's Algorithm — JavaScript port of cpp/pathfinder.cpp
// ---------------------------------------------------------------------------

/**
 * findShortestPath(fromId, toId)
 * Returns: { path: number[], totalDistance: number }
 *   path — ordered array of node IDs (inclusive of start and end)
 *   totalDistance — total path length in meters (-1 if no path)
 */
export function findShortestPath(fromId, toId) {
  if (fromId === toId) {
    return { path: [fromId], totalDistance: 0 };
  }

  const adj = buildAdjacencyList(CAMPUS_NODES, CAMPUS_EDGES);

  const INF = Infinity;
  const dist = {};
  const prev = {};

  for (const node of CAMPUS_NODES) {
    dist[node.id] = INF;
    prev[node.id] = -1;
  }

  dist[fromId] = 0;

  // Min-heap: [distance, nodeId]
  const pq = new MinHeap();
  pq.push([0, fromId]);

  while (pq.size > 0) {
    const [d, u] = pq.pop();

    if (d > dist[u]) continue; // stale entry

    if (u === toId) break; // reached destination

    for (const edge of (adj[u] || [])) {
      const newDist = dist[u] + edge.weight;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        prev[edge.to] = u;
        pq.push([newDist, edge.to]);
      }
    }
  }

  // No path found
  if (dist[toId] === INF) {
    return { path: [], totalDistance: -1 };
  }

  // Reconstruct path
  const path = [];
  for (let cur = toId; cur !== -1; cur = prev[cur]) {
    path.push(cur);
  }
  path.reverse();

  return { path, totalDistance: dist[toId] };
}

// ---------------------------------------------------------------------------
// Route Step Builder
// Converts a path (array of node IDs) into human-readable directions
// ---------------------------------------------------------------------------

export function buildRouteSteps(path) {
  if (!path || path.length < 2) return [];

  const adj = buildAdjacencyList(CAMPUS_NODES, CAMPUS_EDGES);
  const steps = [];

  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = NODE_MAP[path[i]];
    const toNode   = NODE_MAP[path[i + 1]];

    // Find edge weight
    let segDist = 0;
    for (const edge of (adj[path[i]] || [])) {
      if (edge.to === path[i + 1]) { segDist = edge.weight; break; }
    }

    const timeSeconds = segDist / WALKING_SPEED_MPS;
    const timeStr = timeSeconds < 60
      ? `< 1 min`
      : `~${Math.round(timeSeconds / 60)} min`;

    steps.push({
      step:     i + 1,
      from:     fromNode.name,
      to:       toNode.name,
      distance: segDist,
      time:     timeStr,
      fromId:   path[i],
      toId:     path[i + 1],
      icon:     toNode.icon,
    });
  }

  return steps;
}

// ---------------------------------------------------------------------------
// WASM Integration (optional — uncomment when Emscripten build is available)
// ---------------------------------------------------------------------------
// let wasmModule = null;
//
// export async function loadWasm() {
//   try {
//     const PathfinderModule = await import('/pathfinder.js');
//     wasmModule = await PathfinderModule.default();
//
//     wasmModule._initGraph();
//
//     for (const node of CAMPUS_NODES) {
//       const namePtr  = wasmModule.allocateUTF8(node.name);
//       const typePtr  = wasmModule.allocateUTF8(node.type);
//       wasmModule._addNode(node.id, namePtr, typePtr, node.x, node.y);
//       wasmModule._free(namePtr);
//       wasmModule._free(typePtr);
//     }
//
//     for (const edge of CAMPUS_EDGES) {
//       wasmModule._addEdge(edge.from, edge.to, edge.weight);
//     }
//
//     console.log('[WASM] Pathfinder module loaded successfully');
//     return true;
//   } catch (e) {
//     console.warn('[WASM] Falling back to JS Dijkstra:', e.message);
//     return false;
//   }
// }
//
// export function wasmFindPath(fromId, toId) {
//   if (!wasmModule) return findShortestPath(fromId, toId);
//   const ptr = wasmModule._findPath(fromId, toId);
//   const json = wasmModule.UTF8ToString(ptr);
//   wasmModule._free(ptr);
//   const path = JSON.parse(json);
//   const dist = wasmModule._getTotalDistance(fromId, toId);
//   return { path, totalDistance: dist };
// }
