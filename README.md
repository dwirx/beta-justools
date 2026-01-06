# 🛠️ DevTools Hub

Koleksi tools developer dan aplikasi mini dalam satu platform dengan **auto-detection** untuk TSX dan HTML apps.

---

## ✨ Features

| Feature | Deskripsi |
|---------|-----------|
| 🔒 **Privacy First** | Semua tools berjalan di browser, tidak ada data yang dikirim ke server |
| 📱 **Fully Responsive** | Optimized untuk desktop, tablet, dan mobile |
| ⚡ **Fast & Lightweight** | Built dengan Vite untuk loading cepat |
| 🎨 **Modern UI** | Dark theme dengan animasi smooth menggunakan Framer Motion |
| 🔧 **Zero Config Auto-Detection** | Tambah file, langsung terdeteksi tanpa konfigurasi! |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Struktur Project

```
src/
├── apps/                      ← 🆕 TSX Apps (Auto-Detected!)
│   ├── HelloWorld.tsx         ← Single file app
│   └── counter-app/           ← Project folder
│       ├── index.tsx          ← Entry point (wajib)
│       └── components/        ← Sub-components
├── lib/
│   ├── toolRegistry.ts        ← Daftar TSX Tools
│   └── appRegistry.ts         ← Auto-detection logic
├── pages/
│   ├── tools/                 ← Tool pages
│   ├── Index.tsx              ← Homepage
│   └── MyAppsPage.tsx         ← My Apps page (/myapps)
├── components/
│   └── ToolLayout.tsx         ← Layout wrapper untuk tools

public/
└── justhtml/                  ← 🆕 HTML Apps (Auto-Detected!)
    ├── calculator.html        ← Single file app
    ├── snake/                 ← Project folder
    │   ├── index.html         ← Entry point (wajib)
    │   ├── styles.css
    │   └── script.js
    └── quiz-game/             ← Project folder
        ├── index.html
        ├── styles.css
        ├── questions.js
        └── game.js
```

---

# 📦 MENAMBAH APP BARU

## 🔥 Metode 1: TSX Apps (React) - ZERO CONFIG!

TSX apps otomatis terdeteksi dari folder `src/apps/`. **Tidak perlu edit file apapun!**

### A. Single File TSX App

Cukup buat file `.tsx` di `src/apps/`:

**📄 `src/apps/MyApp.tsx`**
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// OPSIONAL: Export metadata untuk kustomisasi
export const appMeta = {
  name: 'My Custom App',           // Nama tampilan (default: dari filename)
  description: 'Deskripsi app',    // Deskripsi singkat
  category: 'Tools' as const,      // Games | Tools | Productivity | Education | Entertainment | Other
  icon: '🚀',                       // Emoji atau nama Lucide icon
  featured: true,                   // Tampilkan badge featured
};

export default function MyApp() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <Button variant="ghost" onClick={() => navigate('/myapps')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <h1 className="text-3xl font-bold">My App</h1>
      {/* Konten app disini */}
    </div>
  );
}
```

✅ **Selesai!** App langsung muncul di `/myapps` dan bisa diakses di `/apps/my-app`

---

### B. Project Folder TSX App (Multiple Components)

Untuk app yang lebih kompleks dengan multiple components:

**📁 Struktur Folder:**
```
src/apps/counter-app/
├── index.tsx              ← Entry point (WAJIB ada!)
├── components/
│   ├── CounterDisplay.tsx
│   ├── CounterControls.tsx
│   └── CounterHistory.tsx
├── hooks/
│   └── useCounter.ts
└── utils/
    └── helpers.ts
```

**📄 `src/apps/counter-app/index.tsx`**
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CounterDisplay from './components/CounterDisplay';
import CounterControls from './components/CounterControls';

// OPSIONAL: Metadata
export const appMeta = {
  name: 'Counter App',
  description: 'Counter dengan history tracking',
  category: 'Tools' as const,
  icon: 'Calculator',  // Bisa pakai nama Lucide icon
  featured: true,
};

export default function CounterApp() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background p-8">
      <Button variant="ghost" onClick={() => navigate('/myapps')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <CounterDisplay count={count} />
      <CounterControls 
        onIncrement={() => setCount(c => c + 1)}
        onDecrement={() => setCount(c => c - 1)}
      />
    </div>
  );
}
```

**📄 `src/apps/counter-app/components/CounterDisplay.tsx`**
```tsx
interface Props {
  count: number;
}

export default function CounterDisplay({ count }: Props) {
  return (
    <div className="text-6xl font-bold text-center">
      {count}
    </div>
  );
}
```

✅ **Selesai!** App terdeteksi sebagai "TSX Project" dan muncul di `/apps/counter-app`

---

## 🌐 Metode 2: HTML Apps - ZERO CONFIG!

HTML apps otomatis terdeteksi dari folder `public/justhtml/`. **Tidak perlu edit file apapun!**

### A. Single File HTML App

Cukup buat file `.html` di `public/justhtml/`:

**📄 `public/justhtml/my-tool.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tool</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, sans-serif;
      background: #1a1a2e;
      color: white;
      min-height: 100vh;
    }
    .nav-bar {
      display: flex;
      gap: 10px;
      padding: 16px;
      background: rgba(0,0,0,0.3);
    }
    .nav-btn {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(255,255,255,0.1);
    }
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <!-- WAJIB: Navigation buttons -->
  <nav class="nav-bar">
    <a href="/" class="nav-btn">🏠 Home</a>
    <a href="/myapps" class="nav-btn">← Back</a>
  </nav>

  <div class="container">
    <h1>My Tool</h1>
    <!-- Konten disini -->
  </div>

  <script>
    // JavaScript code
  </script>
</body>
</html>
```

✅ **Selesai!** App muncul di `/myapps` dan bisa diakses di `/justhtml/my-tool.html`

---

### B. Project Folder HTML App (Multiple Files)

Untuk app yang lebih kompleks:

**📁 Struktur Folder:**
```
public/justhtml/quiz-game/
├── index.html      ← Entry point (WAJIB ada!)
├── styles.css      ← Stylesheet
├── questions.js    ← Data
└── game.js         ← Logic
```

**📄 `public/justhtml/quiz-game/index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Game</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- WAJIB: Navigation -->
  <nav class="nav-bar">
    <a href="/" class="nav-btn">🏠 Home</a>
    <a href="/myapps" class="nav-btn">← Back</a>
  </nav>

  <div class="container">
    <h1>Quiz Game</h1>
    <div id="quiz"></div>
  </div>

  <script src="questions.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

✅ **Selesai!** App terdeteksi sebagai "HTML Project" dan muncul di `/justhtml/quiz-game/index.html`

---

## 🎨 Kustomisasi HTML Apps (Opsional)

Untuk mengubah nama, icon, atau kategori HTML apps, edit `src/lib/appRegistry.ts`:

```ts
const htmlCustomizations: Record<string, HtmlCustomization> = {
  // Key = nama file/folder (lowercase, tanpa extension)
  'quiz-game': {
    name: 'Quiz Master',              // Override nama
    description: 'Test your knowledge',
    category: 'Games',                // Games | Tools | Productivity | Education | Entertainment
    icon: '🧠',
    featured: true,
  },
  'my-tool': {
    name: 'My Awesome Tool',
    description: 'A useful tool',
    category: 'Tools',
    icon: '🔧',
  },
};
```

---

# 🏷️ Tipe App yang Terdeteksi

| Type | Icon | Deskripsi | Contoh |
|------|------|-----------|--------|
| `tsx-single` | ⚛️ | Single React file | `src/apps/HelloWorld.tsx` |
| `tsx-project` | 📦 | React project folder | `src/apps/counter-app/index.tsx` |
| `html-single` | 📄 | Single HTML file | `public/justhtml/calc.html` |
| `html-project` | 📁 | HTML project folder | `public/justhtml/snake/index.html` |

---

# 🏷️ Kategori

| Kategori | Untuk App Jenis |
|----------|-----------------|
| `Games` | Game & hiburan interaktif |
| `Tools` | Utility & calculator |
| `Productivity` | Todo, notes, timer |
| `Education` | Quiz, learning |
| `Entertainment` | Fun apps |
| `Other` | Lainnya (default) |

---

# 🛠️ TSX Tools (Homepage Tools)

Untuk tools yang muncul di **homepage** (bukan My Apps), gunakan sistem terpisah:

### Langkah 1: Buat Tool Page

**📄 `src/pages/tools/MyToolPage.tsx`**
```tsx
import ToolLayout from '@/components/ToolLayout';
import { useState } from 'react';

const MyToolPage = () => {
  const [value, setValue] = useState('');

  return (
    <ToolLayout 
      title="My Tool" 
      description="Tool description here"
    >
      <div className="space-y-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-3 bg-card border border-border rounded-lg"
          placeholder="Enter something..."
        />
      </div>
    </ToolLayout>
  );
};

export default MyToolPage;
```

### Langkah 2: Daftarkan di Registry

**📄 `src/lib/toolRegistry.ts`**
```ts
import { lazy } from 'react';

// Tambahkan di array:
{
  id: 'my-tool',                // URL: /my-tool
  name: 'My Tool',              // Nama tampilan
  description: 'Tool untuk...',  // Deskripsi
  category: 'utility',          // converter | developer | text | image | utility
  icon: '🔧',
  tags: ['keyword1', 'keyword2'],
  featured: false,
  component: lazy(() => import('@/pages/tools/MyToolPage')),
},
```

✅ Tool muncul di homepage dan bisa diakses di `/my-tool`

---

# 🎨 Styling Guidelines

### ✅ BENAR - Gunakan Semantic Tokens
```tsx
className="bg-background text-foreground"
className="bg-card border-border"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="bg-accent text-accent-foreground"
```

### ❌ SALAH - Jangan Hardcode Warna
```tsx
className="bg-white text-black"
className="bg-gray-900 text-gray-100"
```

---

# 📱 Responsive Breakpoints

| Device | Breakpoint | Tailwind Class |
|--------|------------|----------------|
| 📱 Mobile | < 640px | Default |
| 📱 Tablet | 640px - 1024px | `sm:`, `md:` |
| 💻 Desktop | > 1024px | `lg:`, `xl:` |

---

# 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Framer Motion | Animations |
| React Router | Routing |
| Lucide React | Icons |

---

# 📋 Checklist Menambah App Baru

## TSX App
- [ ] Buat file di `src/apps/` (single file atau folder dengan `index.tsx`)
- [ ] Export default component
- [ ] (Opsional) Export `appMeta` untuk kustomisasi
- [ ] Tambah tombol "Back to Apps" untuk navigasi

## HTML App  
- [ ] Taruh file di `public/justhtml/` (single file atau folder dengan `index.html`)
- [ ] Tambah navigation bar dengan link Home dan Back
- [ ] (Opsional) Tambah kustomisasi di `htmlCustomizations`

---

# ❓ FAQ

### Q: Apakah perlu restart dev server setelah menambah app?
**A:** Ya, karena `import.meta.glob` diproses saat build time. Restart dengan `npm run dev`.

### Q: Kenapa app saya tidak muncul?
**A:** Pastikan:
- TSX: File ada di `src/apps/` dengan nama `.tsx` atau folder dengan `index.tsx`
- HTML: File ada di `public/justhtml/` dengan nama `.html` atau folder dengan `index.html`
- Restart dev server

### Q: Bagaimana cara menghapus app?
**A:** Cukup hapus file/folder, lalu restart dev server.

### Q: Apakah bisa pakai framework lain (Vue, Svelte)?
**A:** Tidak, project ini khusus React + Vite.

---

Made with ❤️ using [Lovable](https://lovable.dev)
