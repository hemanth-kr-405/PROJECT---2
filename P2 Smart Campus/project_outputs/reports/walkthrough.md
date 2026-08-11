# Completed Chat Native Desktop Notifications Walkthrough

I have added browser **Desktop Notifications** and a **Notification Toggle Option** to the 1-to-1 Campus Chat.

---

## Changes Implemented

### 1. Notification Toggle Option
- **Sidebar Integration**: Added a toggle button (`🔔 On` / `🔕 Off`) to the current user's profile card at the top-left of the chat sidebar.
- **Browser Permission Request**: Clicking this button:
  - If enabling, requests standard browser notification permission using the HTML5 Notification API (`Notification.requestPermission()`).
  - Saves the user's notification preference (sound + desktop banner) inside the local database (`localStorage` key: `SIT_CHAT_NOTIFICATIONS_ENABLED`).
  - Mutes/unmutes both incoming audio chimes and native browser push banners.

### 2. Browser Desktop Push Notifications
- **Global Broadcast Interceptor**: Integrated notification triggers globally inside the `storage` event handler.
- **Background Support**: When a new message is received from another user, if notifications are enabled:
  - Plays the double-tone audio chime.
  - Sends a standard browser **Desktop Notification** containing the sender's name and message preview text (indicating images and file attachments as well).
  - Works globally: triggers even if the user is on the Map, Directory, Dashboard, or even if the tab is in the background or minimized.
  - **Click to Focus & Redirect**: Clicking the desktop notification focuses the browser window, redirects the user automatically to the `chat` view, and opens the corresponding active contact conversation list.

---

## Verification Guide

1. Log in as a student (e.g. USN `1SI25CS001`, password `SIT@001`).
2. Go to the **Chat** tab in the header.
3. Click the notification bell button at the top of the sidebar.
   - Accept the browser permission request when prompted.
   - Verify the button updates to `🔔 On`.
4. Open the site in a second tab/window (or in an Incognito window / another browser) and log in as a Faculty member (e.g., `Dr. Alan Turing`, password `SIT@f1`). Ensure the Faculty member's Chat notifications are also toggled to `🔔 On`.
5. Go to the **Map** tab (or any non-chat tab) in the student's tab, or minimize it.
6. From the Faculty member's chat tab, send a message to student `Hemanth Kumar`.
7. Verify that:
   - The student's system plays a double-tone notification sound.
   - The operating system displays a native **desktop push notification banner** containing the message.
   - Clicking the desktop banner focuses the student tab, switches to the chat view, and opens the active conversation.
8. Click the bell button in the student's sidebar to set it to `🔕 Off`.
9. Send another message from the Faculty member. Verify that no notification sound or desktop banner appears.

### 3. Recently Chatted Message First Sorting
- **Dynamic Sorting**: Updated the chat sidebar list to sort active contacts based on the timestamp of their most recent message in descending order.
- **Alphabetical Fallback**: For contacts with no message history, the system falls back to sorting alphabetically by name.
- **Real-Time Ordering**: Sending or receiving a message now instantly bubbles that contact to the top of the sidebar.

---

## Additional Verification for Contact Sorting

10. Go to the **Chat** tab in the student mode. Note the initial alphabetically sorted contact list.
11. Select a contact from the middle or bottom of the list (e.g. `Dr. Marie Curie`) and send a text message.
12. Verify that `Dr. Marie Curie` immediately bubbles up to the very top of the conversations sidebar list.
13. Log in as a Faculty member in another tab, open Chat, select student `Hemanth Kumar`, and send a message.
14. Switch back to the student tab, and verify that the Faculty member who sent the message has automatically bubbled up to the top of the list in real-time.

### 4. Layout Overlay Positioning Fix
- **Constraint to app-layout**: Added `position: relative;` to `#app-layout` styling in `index.html`. This ensures that absolute overlays (such as Chat sidebar, Dashboard, Events, and Emergency) are correctly bound to the layout container below the main navbar.
- **Occlusion Fixed**: Fixed the issue where the transparent/glassmorphic navbar header was overlapping and hiding the top of the chat sidebar profile details.

---

## Additional Verification for Overlay Layout

15. Open the application in your browser.
16. Go to the **Chat** tab.
17. Verify that the user profile header (avatar, edit profile link, gear icon `⚙️`, notification bell button) and the "Conversations" header are fully visible and not hidden behind the navbar branding.

### 5. Viewport Height Constraint & Scrollbar Fix
- **Viewport Height Constraint**: Changed `min-height: 100vh` to `height: 100vh` on the `body` selector in `index.html`. This enforces a strict layout boundary that matches the window height.
- **Scrollbar Activation & Input Visibility**: By capping the screen height, the chat containers can no longer grow off-screen. This forces the contact list and chat conversation panels to activate their inner scrollbars (`overflow-y: auto`), keeping the bottom message input panel fully visible and stationary at the bottom of the page.

---

## Additional Verification for Scroll and Input Visibility

18. Open the application, go to **Chat**, and select any contact.
19. Verify that the message input panel (with attachment clips and the "🚀 Send" button) is clearly visible at the bottom of the screen.
20. Type and send a few long messages to fill the conversation area. Verify that the messages pane scrolls independently, keeping the input area fixed and fully accessible.

### 6. In-App Notification Toast System & Read Status Tracking
- **Login Unread Popups**: Upon successful login, the system automatically checks for any unread messages received in the user's history. It groups them by sender and pops up an elegant in-app notification toast at the top-right of the viewport for each sender.
- **Real-Time Notification Popups**: While logged in, if a message arrives from a contact other than the one currently active, an in-app toast notification is shown dynamically.
- **Interaction (Open / Close)**:
  - Clicking the '✕' close button on a toast closes it immediately.
  - Clicking the body of the toast redirects the user directly to the **Chat** tab, selects the sender as the active conversation, marks the messages as read, and closes the toast.
- **Unread Message Badges**: Active contacts in the sidebar list display a green circular badge indicating the count of unread messages from them. Opening the conversation clears the count immediately.

---

## Additional Verification for In-App Notifications

21. Log in as a student in Tab A (e.g. `1SI25CS001`) and send a message to a Faculty member (`Dr. Ashwini B P`).
22. Log out of Tab A, then log back in as `Dr. Ashwini B P` (passcode `SIT@f12`).
23. Verify that upon login, a beautiful in-app notification toast pops up in the top-right corner with the student's name, avatar, and message content.
24. Click the '✕' on the popup and verify that it closes.
25. Repeat the message, log in again, and this time click on the notification body. Verify that it switches to the Chat tab and opens the conversation with that student.
26. Verify that a green unread badge appears next to the contact name in the conversations sidebar, and disappears once the chat is clicked.

### 7. Removal of the Events Feature
- **Navbar Cleaned**: Removed the "📅 Events" tab button from the main navigation menu `#navbar`.
- **View Switch Routing Cleaned**: Deleted Events view references from `switchView()` toggle class logic and conditional check.
- **Dashboard Cleaned**: Deleted the "Featured Upcoming Event" preview card from the Dashboard grid layout.
- **Code Assets Removed**: Deleted `CAMPUS_EVENTS` array, `showEventsView()`, and `registerEvent()` functions from `index.html`.

---

## Additional Verification for Events Removal

27. Open the application in your browser.
28. Verify that the **Events** tab is no longer visible in the horizontal navigation bar.
29. Go to the **Dashboard** view and verify that the "Featured Upcoming Event" panel has been completely removed and the layout adjusts cleanly.

### 8. Realistic 2D Map Redesign
- **Asphalt Roads & Sidewalks**: Standard lines for path edges are replaced by thick asphalt road beds (`stroke-width: 10`) decorated with dashed centerline markings (`stroke-dasharray: 6 6`) to represent realistic roadways/walkways.
- **Detailed Building Footprints**: Replaced abstract node circles with distinct 2D building rectangular and rounded footprint shapes with matching gradients (`building-grad`, `lab-grad`, `facility-grad`, `office-grad`, `hostel-grad`).
- **Sports Complex Stadium**: Drew a detailed stadium layout with a green soccer field, dividing line, and center circle.
- **Landscape Features**: Added solid green lawn areas with scattered trees (small layered SVG circles) and a realistic blue pond (lake) featuring water ripples.
- **CSS-Driven Scale Micro-Animations**: Building footprints scale smoothly (`transform: scale(1.08)`) with a cubic-bezier transition, drop shadows, and title translations entirely handled via CSS rules.

---

## Additional Verification for Realistic Map Redesign

30. Open the application and go to the **Map** tab.
31. Verify that the map background now displays solid green lawn areas, small green trees, and a detailed blue pond with ripple lines.
32. Verify that paths connecting buildings look like asphalt roads with dashed centerlines.
33. Verify that the buildings have rectangular footprints with metallic/glass gradients instead of plain circular dots.
34. Verify that the Sports node displays a detailed green soccer field stadium.
35. Hover over any building node and verify that the building shape scales up smoothly, the label shifts down slightly, and a colorful outer hover ring appears.

### 9. Geolocation & Simulated Live Location Feature
- **Target Location Button**: Added a new target button `🎯` to the map controls panel.
- **Pulsing Blue Dot**: Created a pulsing blue marker (Google Maps style) that dynamically appears on the map using a solid core and CSS keyframe-pulsing halo (`live-pulse-anim`).
- **GPS Calibration for SIT Campus**: Calibrated latitude and longitude coordinates mapping onto the 1000x780 pixel SVG coordinate system using ref points (Main Gate and Engineering B).
- **Simulation Walkthrough Mode**: If the user is off-site (further than 2km from SIT campus center) or geolocation permission is denied, a mock simulator starts, smoothly moving the blue dot step-by-step along a realistic on-campus route path.
- **Custom Route Origin ("My Location")**: When live location is active, a custom `🎯 My Location` option is injected into the starting point dropdown. Calculating a route from "My Location" snaps to the nearest campus node and computes the shortest path.

---

## Additional Verification for Live Location

36. Open the application and go to the **Map** tab.
37. Click the `🎯` button in the bottom-right zoom/map controls.
38. Verify that a location toast slides in: `Campus Location Simulated` or `GPS Active`.
39. Verify that a pulsing blue dot appears on the map. If in simulation mode, verify that the dot moves step-by-step along the campus road paths (e.g. from Main Gate to Central Plaza).
40. Select the **From** dropdown under **Plan Route** and verify that the `🎯 My Location` option is now selectable at the top of the list.
41. Select `🎯 My Location` as the starting point and any building (e.g. `CS Lab`) as the destination. Tap **Find Shortest Path** and verify that a path calculates successfully from the nearest road node.
42. Toggle the `🎯` button off and verify that the blue dot and the `🎯 My Location` dropdown option are removed cleanly.

### 10. Building Label Overlap Fix
- **Dynamic Vertical Spacing**: Adjusted label `y` offsets dynamically based on the building footprint height (ranging from `h/2 + 13` for rectangular blocks to `40` for the sports stadium and `38` for the plaza circle) to prevent any text overlaps.
- **Improved Readability**: Repositioned all text labels directly below their respective building outlines.

---

## Additional Verification for Building Label Alignment

43. Open the application and go to the **Map** tab.
44. Verify that the labels for all locations (e.g. `Admin`, `Cafeteria`, `Sports`, `Hostel`, `Medical`) are rendered clearly below their building footprints and do not overlap with borders or building shapes.

### 11. Realistic Campus Boundary Path
- **Realistic Organic Shape**: Replaced the standard rectangular `<rect>` boundary with a custom SVG `<path>` tracing the actual organic boundary of the Siddaganga Institute of Technology campus.
- **Enclosed Nodes**: Handcrafted the control points of the path (using cubic Bézier curves `C`) to perfectly enclose all 16 campus layout nodes while matching the physical satellite view boundary (with its distinct top-left stadium corridor and right-extending horizontal entrance road strip).

---

## Additional Verification for Realistic Campus Boundary

45. Open the application and go to the **Map** tab.
46. Verify that the outer boundary shape is a custom, realistic organic contour matching the physical boundaries of the SIT campus, rather than a generic rectangle.

### 12. Persistent Backend Database Management System (DBMS)
- **PowerShell REST API Endpoint**: Extended `server.ps1` to serve `/api/db` API endpoint handling `GET`, `POST`, and `OPTIONS` CORS preflight requests natively.
- **Physical Persistent Storage**: Saves and retrieves all custom student passwords, faculty passwords, custom faculty data, custom student profiles, and chat message histories inside a central JSON database file `database/db.json`.
- **Automatic Setup & Seeding**: Automatically creates the `database` folder and initializes `db.json` with empty tables if they are not already present.
- **Client Synchronization**:
  - The browser calls `/api/db` during the main `init()` sequence to load all student and faculty details.
  - Modifying any student or faculty details, resetting passwords, or sending chat messages automatically triggers `saveBackendDatabase()` which makes a REST request to update the backend DBMS.
  - Falls back to `localStorage` as a secondary cache if the network goes offline.

---

## Additional Verification for Backend DBMS

47. Open the directory `c:\PROJECT\P2 Smart Campus\database` and verify that the file `db.json` has been generated and populated.
48. Log in as a student, go to the **Chat** view, and send a message.
49. Open `database/db.json` and verify that the message is instantly saved and written to the persistent database file.
50. Edit your student profile details in the profile modal, save it, and verify that the modified fields are persisted to `db.json`.
51. Log out, close the tab, open the app again in a new session, and verify that the changes and messages remain loaded from the backend database.
