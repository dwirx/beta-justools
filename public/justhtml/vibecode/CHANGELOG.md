# Changelog

All notable changes to VibeDev v7 will be documented in this file.

## [v7.1.3] - 2026-01-08

### 🎨 Redesigned
- **Copy Button UI Overhaul** - Completely redesigned for better visibility and UX
  - Blue button design (bg-blue-600) matching modern UI standards
  - Changes to green (bg-green-600) when copied
  - Larger, more prominent button with proper padding
  - Text label "Copy" / "Copied!" on desktop (hidden on mobile)
  - Icon + text combination for clarity

### 📱 Responsive Improvements
- **Always Visible on Mobile** - Copy button now always visible on mobile devices
  - No need to tap/hold to reveal
  - Positioned below message bubble
  - Touch-friendly size (min 36px height)
- **Hover-to-Show on Desktop** - Button appears on message hover for cleaner desktop UI
- **Adaptive Layout** - Button position adjusts based on message role (user vs AI)

### ✨ Enhanced UX
- Active state animation (scale-95) for tactile feedback
- Better shadow effects (shadow-md → shadow-lg on hover)
- Smooth transitions for all states
- Improved contrast and readability
- Mobile-first responsive design

### 📁 Files Modified
- `js/components/MessageCopyButton.js` - Complete button redesign
- `js/app.js` - Changed button positioning (below bubble instead of inside)
- `README.md` - Updated usage instructions

---

## [v7.1.2] - 2026-01-08

### ✨ Added
- **Copy Success Animations** - Beautiful visual feedback when copying messages
  - Scale animation on copy button (grows then returns to normal)
  - Slide-in animation for check mark icon
  - Green background highlight on success
  - Toast notification with icon slides up from bottom
  - Smooth transitions for all effects

### 🔧 Changed
- Enhanced toast notifications with icons (✓ for success, ✕ for error, ℹ for info)
- Improved animation timing for better UX

### 📁 Files Modified
- `css/styles.css` - Added copy animation keyframes
- `js/components/MessageCopyButton.js` - Added animation states and effects
- `js/utils.js` - Enhanced toast with icons and better animation

---

## [v7.1.1] - 2026-01-08

### 🔧 Changed
- **Individual Message Copy** now copies only the message content text
  - No more `[USER]` or `[ASSISTANT]` headers
  - No metadata (model, tokens, cost) included
  - Clean text only for quick copy-paste
  - Thinking process is excluded from individual copy
  - Use "Copy Chat" from navbar for full formatted export

### 💡 Rationale
- Users requested cleaner copy for quick text extraction
- Full export still available via ChatActionsMenu (navbar button)
- Better UX: hover copy = quick text, navbar export = full details

---

## [v7.1.0] - 2026-01-08

### ✨ Added
- **Export Chat Feature**
  - Copy entire chat to clipboard
  - **Copy individual message** with hover button (NEW!)
  - Download chat as Markdown (.md) with rich formatting
  - Download chat as plain Text (.txt)
  - Toast notifications for user feedback
  - ChatActionsMenu component with beautiful UI
  - MessageCopyButton component for individual messages

- **Utility Functions**
  - `formatChatAsText()` - Format chat messages as plain text
  - `formatChatAsMarkdown()` - Format chat messages as Markdown
  - `copyToClipboard()` - Copy text with fallback support
  - `downloadAsFile()` - Download content as file
  - `generateFilename()` - Generate safe filenames
  - `showToast()` - Show toast notifications

- **UI Improvements**
  - Download button in navbar (next to Analytics)
  - Export modal with 3 options (Copy, MD, TXT)
  - Icon indicators for each export type
  - Message count display in export modal
  - **Hover-to-show copy button** on each message bubble
  - Check mark animation when copy succeeds
  - Positioned intelligently (top-right for AI, top-left for user)

### 📁 Files Added
- `js/utils.js` - Utility functions for export
- `js/components/ChatActionsMenu.js` - Export menu component
- `js/components/MessageCopyButton.js` - Individual message copy button
- `EXAMPLE_EXPORT.md` - Example of exported chat
- `CHANGELOG.md` - This file

### 🔧 Modified
- `index.html` - Added utils.js, ChatActionsMenu.js, and MessageCopyButton.js imports
- `js/app.js` - Added export functionality, state management, and individual copy buttons
- `README.md` - Updated documentation with all export features

### 🐛 Fixed
- Lucide icons not rendering on modal open (added to useEffect deps)

---

## [v7.0.0] - Initial Release

### ✨ Features
- Modular architecture (HTML, CSS, JS separated)
- Multi-model AI support (Claude, Gemini)
- Custom API base URL configuration
- Analytics dashboard with cost tracking
- IndexedDB persistent storage
- Responsive mobile-first design
- Markdown rendering with syntax highlighting
- Thinking process accordion
- Session cost calculator
- Auto-save conversations
- Dark theme optimized UI

### 📁 File Structure
```
vibecode/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── tailwind.config.js
    ├── config.js
    ├── database.js
    ├── app.js
    └── components/
        ├── AnalyticsModal.js
        ├── Markdown.js
        ├── Thinking.js
        └── MessageFooter.js
```
