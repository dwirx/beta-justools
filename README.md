# 🛠️ DevTools - Lightweight Developer Tools

A collection of lightweight, privacy-first developer tools that run entirely in your browser. No data is sent to any server - everything runs locally on your device.

![DevTools Preview](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Platform](https://img.shields.io/badge/Platform-Web-orange)

## ✨ Features

- 🔒 **Privacy First** - All tools run locally in your browser
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - No heavy dependencies
- 🎨 **Beautiful UI** - Modern dark theme with smooth animations
- 🔧 **Extensible** - Easy to add new tools
- 📦 **Zero Configuration** - Just open and use

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone <your-repo-url>
cd devtools

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

The app is fully responsive and works on:
- 📱 **Mobile** (320px - 640px)
- 📱 **Tablet** (640px - 1024px)
- 💻 **Desktop** (1024px+)

## 🛠️ Available Tools

### Format Converters
| Tool | Description |
|------|-------------|
| JSON Formatter | Format and beautify JSON data |
| Base64 Encoder | Encode/decode Base64 strings |
| URL Encoder | Encode/decode URL components |

### Developer Tools
| Tool | Description |
|------|-------------|
| UUID Generator | Generate random UUID v4 |
| Hash Generator | Generate MD5, SHA-1, SHA-256 hashes |
| Unix Timestamp | Convert timestamps and dates |
| Color Converter | Convert HEX, RGB, HSL colors |
| Purple Cipher | PURPLE cipher encryption simulator |

### Text Processing
| Tool | Description |
|------|-------------|
| Word Counter | Count words, characters, sentences |
| Text Case Converter | Convert text cases |
| Lorem Ipsum Generator | Generate placeholder text |

### Utilities
| Tool | Description |
|------|-------------|
| Password Generator | Generate secure passwords |
| Number Base Converter | Convert binary, octal, decimal, hex |

## 🎮 My Apps (HTML Apps)

The `/myapps` section contains standalone HTML apps:

| App | Category | Description |
|-----|----------|-------------|
| Tic Tac Toe | Games | Classic Tic Tac Toe game |
| Snake Game | Games | Classic Snake with mobile controls |
| Memory Game | Games | Card matching memory game |
| Calculator | Tools | Simple calculator |
| Stopwatch | Tools | Stopwatch with lap timer |
| Prompt Library | Tools | Collection of useful prompts |
| Todo List | Productivity | Todo list with localStorage |
| Quick Notes | Productivity | Color-coded notes app |

### How to Add HTML Apps

1. **Single File App:**
   ```
   public/justhtml/myapp.html
   ```

2. **Multi-file Project:**
   ```
   public/justhtml/myproject/
   ├── index.html
   ├── styles.css
   └── script.js
   ```

3. **Register in `src/data/apps.ts`:**
   ```typescript
   {
     id: 'myapp',
     name: 'My App',
     description: 'Description here',
     type: 'single-file', // or 'project'
     path: 'myapp.html', // or 'myproject/index.html'
     category: 'Games', // Games, Tools, or Productivity
   }
   ```

## ➕ Adding New Tools (TSX)

Adding a new tool is simple! Just follow these steps:

### Step 1: Create Tool Page

Create a new file in `src/pages/tools/YourToolPage.tsx`:

```tsx
import { ToolLayout } from '@/components/ToolLayout';

const YourToolPage = () => {
  return (
    <ToolLayout
      toolName="Your Tool Name"
      toolIcon="🔧"
      toolDescription="What your tool does"
    >
      {/* Your tool UI here */}
      <div className="space-y-4">
        <input 
          type="text" 
          className="tool-input" 
          placeholder="Enter text..."
        />
        <button className="action-button primary">
          Process
        </button>
      </div>
    </ToolLayout>
  );
};

export default YourToolPage;
```

### Step 2: Register in Tool Registry

Add your tool to `src/lib/toolRegistry.ts`:

```typescript
{
  id: 'your-tool',           // URL path (e.g., /your-tool)
  name: 'Your Tool Name',    // Display name
  description: 'Tool description',
  category: 'developer',     // converter | developer | text | image | utility
  icon: '🔧',                // Emoji icon
  tags: ['tag1', 'tag2'],    // Search tags
  featured: false,           // Show featured badge?
  component: lazy(() => import('@/pages/tools/YourToolPage')),
},
```

That's it! ✅ The tool is automatically:
- Added to the homepage grid
- Gets its own route (`/your-tool`)
- Searchable by name, description, and tags

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Header.tsx       # Main header with navigation
│   ├── Hero.tsx         # Hero section with stats
│   ├── SearchFilter.tsx # Search and category filters
│   ├── ToolCard.tsx     # Tool card component
│   ├── ToolLayout.tsx   # Layout wrapper for tools
│   └── ToolsGrid.tsx    # Grid of tool cards
├── data/
│   └── apps.ts          # HTML apps registry
├── lib/
│   ├── toolRegistry.ts  # Tool registry (auto-routing)
│   └── utils.ts         # Utility functions
├── pages/
│   ├── tools/           # Individual tool pages
│   ├── Index.tsx        # Homepage
│   ├── MyAppsPage.tsx   # HTML apps page
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Main app with routing
├── index.css            # Global styles & design tokens
└── main.tsx             # Entry point

public/
└── justhtml/            # Standalone HTML apps
    ├── calculator.html
    ├── snake/
    ├── tictactoe/
    └── ...
```

## 🎨 Design System

The app uses CSS custom properties (design tokens) defined in `src/index.css`:

```css
/* Main colors */
--primary: 199 89% 48%;      /* Cyan blue */
--accent: 270 70% 60%;       /* Purple */
--background: 222 47% 6%;    /* Dark background */

/* Category colors */
--category-converter: 199 89% 48%;
--category-developer: 142 70% 45%;
--category-text: 45 90% 50%;
--category-image: 330 70% 55%;
--category-utility: 270 70% 60%;
```

### CSS Classes

| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphism card |
| `.gradient-text` | Gradient text effect |
| `.tool-card` | Tool card with hover effects |
| `.tool-input` | Styled text input |
| `.tool-output` | Output display area |
| `.action-button.primary` | Primary gradient button |
| `.action-button.secondary` | Secondary button |
| `.filter-button` | Category filter button |

## 🔧 Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons
- **Shadcn/ui** - UI components

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-tool`)
3. Add your tool following the guide above
4. Commit your changes (`git commit -m 'Add new tool'`)
5. Push to the branch (`git push origin feature/new-tool`)
6. Open a Pull Request

---

Made with ❤️ using [Lovable](https://lovable.dev)
