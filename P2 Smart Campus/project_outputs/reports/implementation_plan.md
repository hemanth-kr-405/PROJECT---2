# Implementation Plan - Chat Desktop Notifications & Option Toggle

This plan adds browser **Desktop Notifications** and a **Notification Toggle Button** in the Chat view conversations sidebar header, allowing users to enable/disable sound and browser alert options.

---

## Proposed Changes

### Notification Logic & Sidebar Option

#### [MODIFY] [index.html](file:///c:/PROJECT/P2%20Smart%20Campus/index.html)

1. **Notification Toggle Option in Sidebar**:
   - Modify the Current User Profile Header in `renderChatLayout()` to include a bell button (`🔔 On` / `🔕 Off`).
   - Implement `toggleChatNotifications(event)`:
     - Toggle `localStorage` state for `SIT_CHAT_NOTIFICATIONS_ENABLED`.
     - If enabling, request standard browser notification permission using `Notification.requestPermission()`.
     - Re-render the chat layout to refresh the bell toggle status text.

2. **Cross-Tab Broadcast Integration**:
   - Update the cross-tab `storage` event listener inside `init()`:
     - If a new message is received for the current user, check if desktop notifications are enabled:
       - If enabled and browser permission is granted, instantiate a `new Notification("💬 Sender Name", { body: text, icon: senderPhoto })`.
       - Add an `onclick` listener to the notification object to focus the window, select the active contact, and open the chat view.
     - Play the audio notification chime only if notifications are not muted.

---

## Verification Plan

### Manual Verification
1. Open the Chat tab. Verify the bell toggle button appears in the sidebar next to your profile photo.
2. Click the bell button to enable notifications.
   - Verify the browser displays a standard permission request prompt: *"Smart Campus Navigation wants to show notifications"*.
   - Allow permissions. Verify the button changes to `🔔 On`.
3. Open a second tab logged in as a different user.
4. Send a message to the first user.
5. Verify the first tab receives the message, plays the audio chime, and displays a native operating system **desktop notification** previewing the sender name and message content.
6. Click the desktop notification. Verify it focuses the browser window and opens the corresponding chat conversation.
7. Click the bell button in the sidebar again. Verify the toggle changes to `🔕 Off`.
8. Send another message. Verify that no desktop notifications appear.
