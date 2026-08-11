/**
 * Smart Campus Navigation System
 * Campus Graph Data — Nodes (Buildings/Locations) & Edges (Paths)
 *
 * This data mirrors the graph initialized in cpp/pathfinder.cpp.
 * x, y coordinates are in SVG viewBox space (0-1000 x 0-800).
 * weight is in meters (approx walking distance).
 */

export const CAMPUS_NODES = [
  // ── GATES & JUNCTIONS ──────────────────────────────────────────────
  {
    id: 1,
    name: "Main Gate",
    shortName: "Main Gate",
    type: "junction",
    x: 100, y: 500,
    description: "Primary entrance to the campus. Security check-in point.",
    floor: "Ground",
    hours: "Open 24/7",
    icon: "🏛️",
    color: "#6366f1",
  },
  {
    id: 11,
    name: "North Gate",
    shortName: "North Gate",
    type: "junction",
    x: 400, y: 30,
    description: "Secondary north campus entrance for staff.",
    floor: "Ground",
    hours: "6:00 AM – 10:00 PM",
    icon: "🚪",
    color: "#6366f1",
  },
  {
    id: 12,
    name: "Central Plaza",
    shortName: "Plaza",
    type: "junction",
    x: 400, y: 400,
    description: "Central open plaza — hub connecting all major blocks.",
    floor: "Ground",
    hours: "Open 24/7",
    icon: "🌳",
    color: "#22c55e",
  },

  // ── ACADEMIC BUILDINGS ──────────────────────────────────────────────
  {
    id: 2,
    name: "Admin Block",
    shortName: "Admin",
    type: "building",
    x: 200, y: 280,
    description: "Administration offices, registrar, and dean's office.",
    floor: "Floors 1–3",
    hours: "Mon–Fri 9:00 AM – 5:00 PM",
    icon: "🏢",
    color: "#3b82f6",
  },
  {
    id: 13,
    name: "Engineering Block A",
    shortName: "Eng-A",
    type: "building",
    x: 570, y: 220,
    description: "Mechanical, Civil, and Electrical Engineering departments.",
    floor: "Floors 1–4",
    hours: "Mon–Sat 8:00 AM – 8:00 PM",
    icon: "⚙️",
    color: "#3b82f6",
  },
  {
    id: 14,
    name: "Engineering Block B",
    shortName: "Eng-B",
    type: "building",
    x: 700, y: 320,
    description: "Electronics and Communication, Robotics department.",
    floor: "Floors 1–4",
    hours: "Mon–Sat 8:00 AM – 8:00 PM",
    icon: "🤖",
    color: "#3b82f6",
  },
  {
    id: 6,
    name: "Auditorium",
    shortName: "Auditorium",
    type: "building",
    x: 630, y: 490,
    description: "Main auditorium — 2000 seat capacity, events & seminars.",
    floor: "Ground + Balcony",
    hours: "By event schedule",
    icon: "🎭",
    color: "#8b5cf6",
  },
  {
    id: 8,
    name: "Hostel Block",
    shortName: "Hostel",
    type: "building",
    x: 130, y: 700,
    description: "Student residential hostel. Boys' and Girls' wings.",
    floor: "Floors 1–6",
    hours: "Open 24/7",
    icon: "🏠",
    color: "#f59e0b",
  },

  // ── LABS ────────────────────────────────────────────────────────────
  {
    id: 4,
    name: "CS Lab",
    shortName: "CS Lab",
    type: "lab",
    x: 560, y: 330,
    description: "Computer Science laboratory — 120 workstations, high-speed internet.",
    floor: "Floor 2",
    hours: "Mon–Sat 8:00 AM – 9:00 PM",
    icon: "💻",
    color: "#06b6d4",
  },
  {
    id: 10,
    name: "Physics Lab",
    shortName: "Physics Lab",
    type: "lab",
    x: 460, y: 120,
    description: "Advanced physics and optics experiments laboratory.",
    floor: "Floor 1",
    hours: "Mon–Fri 9:00 AM – 6:00 PM",
    icon: "⚗️",
    color: "#06b6d4",
  },
  {
    id: 15,
    name: "Chemistry Lab",
    shortName: "Chem Lab",
    type: "lab",
    x: 280, y: 140,
    description: "Organic and inorganic chemistry research laboratory.",
    floor: "Floor 1",
    hours: "Mon–Fri 9:00 AM – 6:00 PM",
    icon: "🧪",
    color: "#06b6d4",
  },

  // ── FACILITIES ──────────────────────────────────────────────────────
  {
    id: 3,
    name: "Library",
    shortName: "Library",
    type: "facility",
    x: 350, y: 220,
    description: "Central library — 50,000+ books, digital resources, study rooms.",
    floor: "Floors 1–3",
    hours: "Mon–Sat 8:00 AM – 10:00 PM",
    icon: "📚",
    color: "#10b981",
  },
  {
    id: 5,
    name: "Cafeteria",
    shortName: "Cafeteria",
    type: "facility",
    x: 310, y: 430,
    description: "Main campus cafeteria — breakfast, lunch, dinner served daily.",
    floor: "Ground Floor",
    hours: "7:00 AM – 10:00 PM",
    icon: "🍽️",
    color: "#f97316",
  },
  {
    id: 7,
    name: "Sports Complex",
    shortName: "Sports",
    type: "facility",
    x: 790, y: 580,
    description: "Football ground, basketball court, tennis courts, and gym.",
    floor: "Ground",
    hours: "6:00 AM – 8:00 PM",
    icon: "⚽",
    color: "#22c55e",
  },
  {
    id: 9,
    name: "Medical Center",
    shortName: "Medical",
    type: "office",
    x: 460, y: 640,
    description: "Campus health center — doctors, nurses, first aid, pharmacy.",
    floor: "Ground Floor",
    hours: "Mon–Sat 8:00 AM – 8:00 PM",
    icon: "🏥",
    color: "#ef4444",
  },
  {
    id: 16,
    name: "Placement Cell",
    shortName: "Placement",
    type: "office",
    x: 200, y: 420,
    description: "Career guidance, internships, and campus placement office.",
    floor: "Floor 2, Admin Block",
    hours: "Mon–Fri 9:00 AM – 5:00 PM",
    icon: "💼",
    color: "#a855f7",
  },
];

// ---------------------------------------------------------------------------
// Campus edges — undirected walkable paths with distances in meters
// ---------------------------------------------------------------------------

export const CAMPUS_EDGES = [
  // Main gate connections
  { from: 1,  to: 2,  weight: 130 }, // Main Gate → Admin Block
  { from: 1,  to: 8,  weight: 110 }, // Main Gate → Hostel
  { from: 1,  to: 16, weight: 140 }, // Main Gate → Placement Cell

  // Admin Block connections
  { from: 2,  to: 3,  weight: 160 }, // Admin → Library
  { from: 2,  to: 15, weight: 120 }, // Admin → Chemistry Lab
  { from: 2,  to: 16, weight: 60  }, // Admin → Placement Cell
  { from: 2,  to: 5,  weight: 100 }, // Admin → Cafeteria

  // Library connections
  { from: 3,  to: 10, weight: 120 }, // Library → Physics Lab
  { from: 3,  to: 15, weight: 90  }, // Library → Chemistry Lab
  { from: 3,  to: 4,  weight: 170 }, // Library → CS Lab
  { from: 3,  to: 12, weight: 140 }, // Library → Central Plaza

  // North Gate / Physics / Chemistry
  { from: 11, to: 10, weight: 80  }, // North Gate → Physics Lab
  { from: 11, to: 15, weight: 100 }, // North Gate → Chemistry Lab
  { from: 10, to: 13, weight: 130 }, // Physics Lab → Eng-A
  { from: 10, to: 15, weight: 110 }, // Physics Lab → Chemistry Lab

  // Engineering blocks
  { from: 13, to: 4,  weight: 80  }, // Eng-A → CS Lab
  { from: 13, to: 14, weight: 100 }, // Eng-A → Eng-B
  { from: 4,  to: 14, weight: 90  }, // CS Lab → Eng-B
  { from: 4,  to: 12, weight: 100 }, // CS Lab → Central Plaza
  { from: 14, to: 6,  weight: 120 }, // Eng-B → Auditorium

  // Central Plaza hub
  { from: 12, to: 5,  weight: 90  }, // Plaza → Cafeteria
  { from: 12, to: 6,  weight: 150 }, // Plaza → Auditorium
  { from: 12, to: 9,  weight: 180 }, // Plaza → Medical Center

  // Cafeteria area
  { from: 5,  to: 16, weight: 80  }, // Cafeteria → Placement Cell
  { from: 5,  to: 9,  weight: 140 }, // Cafeteria → Medical Center

  // South campus
  { from: 6,  to: 7,  weight: 110 }, // Auditorium → Sports Complex
  { from: 7,  to: 9,  weight: 150 }, // Sports → Medical
  { from: 9,  to: 8,  weight: 180 }, // Medical → Hostel
  { from: 8,  to: 16, weight: 170 }, // Hostel → Placement Cell
];

// ---------------------------------------------------------------------------
// Helper lookups
// ---------------------------------------------------------------------------

export const NODE_MAP = Object.fromEntries(
  CAMPUS_NODES.map(n => [n.id, n])
);

export const TYPE_LABELS = {
  building: "Academic Building",
  lab:      "Laboratory",
  facility: "Facility",
  office:   "Office",
  junction: "Campus Area",
};

export const WALKING_SPEED_MPS = 1.4; // meters per second (~5 km/h)

export function estimateWalkTime(distanceMeters) {
  const seconds = distanceMeters / WALKING_SPEED_MPS;
  if (seconds < 60) return `< 1 min`;
  const mins = Math.round(seconds / 60);
  return `~${mins} min`;
}

// ---------------------------------------------------------------------------
// Faculty Members & Schedule Database (Synced with campus nodes)
// Status Indicators:
//   🟢 'available'  - Currently in office / free for consultation
//   🔴 'busy'       - In class / lecture / meeting
//   ⚪ 'unavailable'- Off-campus / unknown
// ---------------------------------------------------------------------------

export const FACULTY_MEMBERS = [
  {
    id: "f1",
    name: "Dr. Alan Turing",
    title: "Professor & Head of CS",
    dept: "Computer Science",
    locationId: 4, // CS Lab
    officeRoom: "CS Building - Room 302",
    status: "available",
    statusDetail: "In Office — Free for Student Consultation",
    email: "turing@smartcampus.edu",
    avatar: "👨‍🏫",
    schedule: [
      { time: "09:00 AM - 10:30 AM", event: "CS301: Data Structures Lecture", room: "CS Lab (Room 101)", status: "busy" },
      { time: "11:00 AM - 01:00 PM", event: "Open Office Hours", room: "Room 302", status: "available" },
      { time: "02:00 PM - 04:00 PM", event: "Algorithms Research Guidance", room: "Room 302", status: "available" }
    ]
  },
  {
    id: "f2",
    name: "Dr. Ada Lovelace",
    title: "Senior Professor",
    dept: "Computer Science",
    locationId: 2, // Admin Block
    officeRoom: "Admin Block - Room 210",
    status: "busy",
    statusDetail: "In Class — CS402 Algorithm Design",
    email: "lovelace@smartcampus.edu",
    avatar: "👩‍🏫",
    schedule: [
      { time: "09:00 AM - 11:00 AM", event: "Office Hours", room: "Admin Room 210", status: "available" },
      { time: "11:30 AM - 01:30 PM", event: "CS402: Algorithm Design", room: "Eng-A Hall 3", status: "busy" },
      { time: "02:30 PM - 04:30 PM", event: "Curriculum Committee Meeting", room: "Admin Room 210", status: "busy" }
    ]
  },
  {
    id: "f3",
    name: "Prof. Grace Hopper",
    title: "Associate Dean of Academics",
    dept: "Computer Science",
    locationId: 2, // Admin Block
    officeRoom: "Admin Block - Wing #105",
    status: "available",
    statusDetail: "In Office — Accepting Student Appointments",
    email: "hopper@smartcampus.edu",
    avatar: "👩‍💻",
    schedule: [
      { time: "10:00 AM - 12:30 PM", event: "Student Academic Advising", room: "Wing #105", status: "available" },
      { time: "02:00 PM - 04:00 PM", event: "Academic Senate Meeting", room: "Auditorium", status: "busy" }
    ]
  },
  {
    id: "f4",
    name: "Dr. Albert Einstein",
    title: "Chair of Physics & Optics",
    dept: "Physics",
    locationId: 10, // Physics Lab
    officeRoom: "Physics Building - Room 108",
    status: "busy",
    statusDetail: "In Optics Lab Experiment",
    email: "einstein@smartcampus.edu",
    avatar: "👨‍🔬",
    schedule: [
      { time: "09:00 AM - 12:00 PM", event: "Advanced Optics Lab Practicals", room: "Physics Lab 1", status: "busy" },
      { time: "01:00 PM - 03:30 PM", event: "Physics Consultation Hours", room: "Room 108", status: "available" }
    ]
  },
  {
    id: "f5",
    name: "Dr. Marie Curie",
    title: "Lead Chemistry Researcher",
    dept: "Chemistry",
    locationId: 15, // Chemistry Lab
    officeRoom: "Chemistry Building - Room 204",
    status: "available",
    statusDetail: "In Office — Available for Queries",
    email: "curie@smartcampus.edu",
    avatar: "👩‍🔬",
    schedule: [
      { time: "10:00 AM - 01:00 PM", event: "Open Office Hours", room: "Chem Room 204", status: "available" },
      { time: "02:00 PM - 04:30 PM", event: "Organic Chemistry Lab Session", room: "Chem Lab 2", status: "busy" }
    ]
  },
  {
    id: "f6",
    name: "Dr. Nikola Tesla",
    title: "Professor of Robotics",
    dept: "Electrical & Robotics",
    locationId: 14, // Engineering Block B
    officeRoom: "Eng-B Building - Room 401",
    status: "unavailable",
    statusDetail: "Out of Campus — Tech Summit",
    email: "tesla@smartcampus.edu",
    avatar: "👨‍🔧",
    schedule: [
      { time: "All Day", event: "International Robotics Summit (Off Campus)", room: "External", status: "unavailable" }
    ]
  },
  {
    id: "f7",
    name: "Dr. Richard Feynman",
    title: "Professor of Theoretical Physics",
    dept: "Physics",
    locationId: 10, // Physics Lab
    officeRoom: "Physics Building - Room 202",
    status: "available",
    statusDetail: "In Office — Free for Walk-ins",
    email: "feynman@smartcampus.edu",
    avatar: "👨‍🏫",
    schedule: [
      { time: "11:00 AM - 01:00 PM", event: "Quantum Mechanics Office Hours", room: "Room 202", status: "available" },
      { time: "03:00 PM - 05:00 PM", event: "PHY201 Lecture", room: "Auditorium", status: "busy" }
    ]
  },
  {
    id: "f8",
    name: "Prof. Margaret Hamilton",
    title: "Director of Training & Placement",
    dept: "Placement Cell",
    locationId: 16, // Placement Cell
    officeRoom: "Placement Cell - Main Wing",
    status: "busy",
    statusDetail: "Conducting Placement Interviews",
    email: "hamilton@smartcampus.edu",
    avatar: "👩‍💼",
    schedule: [
      { time: "09:30 AM - 01:00 PM", event: "Campus Recruitment Drive", room: "Placement Room 1", status: "busy" },
      { time: "02:00 PM - 04:30 PM", event: "Student Placement Counseling", room: "Placement Room 1", status: "available" }
    ]
  }
];

