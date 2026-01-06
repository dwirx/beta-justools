# 🛠️ DevTools Hub

Koleksi tools developer dan aplikasi mini dalam satu platform. Mudah ditambah, responsif, dan modern.

---

## ✨ Features

- 🔒 **Privacy First** - Semua tools berjalan di browser
- 📱 **Fully Responsive** - Desktop, tablet, dan mobile
- ⚡ **Fast & Lightweight** - No heavy dependencies
- 🎨 **Modern UI** - Dark theme dengan animasi smooth
- 🔧 **Auto-Detection** - Tambah tool baru, langsung terdeteksi!

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 📦 Menambah Tool/App Baru

### ➕ TSX Tool (React Component)

**Step 1:** Buat file `src/pages/tools/NamaToolPage.tsx`

```tsx
import ToolLayout from '@/components/ToolLayout';
import { useState } from 'react';

const NamaToolPage = () => {
  const [value, setValue] = useState('');

  return (
    <ToolLayout title="Nama Tool" description="Deskripsi tool">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 bg-card border border-border rounded-lg"
      />
    </ToolLayout>
  );
};

export default NamaToolPage;
```

**Step 2:** Daftarkan di `src/lib/toolRegistry.ts`

```ts
{
  id: 'nama-tool',           // ID unik → URL: /nama-tool
  name: 'Nama Tool',         // Nama tampilan
  description: 'Deskripsi',  // Deskripsi singkat
  category: 'developer',     // converter | developer | text | image | utility
  icon: '🔧',                // Emoji icon
  tags: ['tag1', 'tag2'],    // Tags untuk search
  featured: true,            // Optional: badge featured
  component: lazy(() => import('@/pages/tools/NamaToolPage')),
},
```

✅ **Done!** Tool otomatis muncul di homepage + punya route sendiri.

---

### ➕ HTML App

**Step 1:** Taruh file HTML di `public/justhtml/`

| Tipe | Lokasi |
|------|--------|
| Single File | `public/justhtml/app.html` |
| Project | `public/justhtml/app/index.html` |

**Step 2:** Daftarkan di `src/lib/appRegistry.ts`

```ts
{
  id: 'app-baru',
  name: 'Nama App',
  description: 'Deskripsi app',
  type: 'single-file',       // 'single-file' atau 'project'
  path: 'app-baru.html',     // Path dari public/justhtml/
  category: 'Games',         // Games | Tools | Productivity | Education | Entertainment
  icon: '🎮',
  featured: true,            // Optional
},
```

✅ **Done!** App muncul di My Apps page.

---

## 📁 Struktur Project

```
src/
├── lib/
│   ├── toolRegistry.ts    ← ⭐ Daftar TSX Tools
│   └── appRegistry.ts     ← ⭐ Daftar HTML Apps
├── pages/
│   ├── tools/             ← Tool pages
│   ├── Index.tsx          ← Homepage
│   └── MyAppsPage.tsx     ← My Apps page
├── components/
│   └── ToolLayout.tsx     ← Layout wrapper
public/
└── justhtml/              ← HTML Apps folder
```

---

## 🏷️ Kategori

### TSX Tools
| Category | Contoh |
|----------|--------|
| `converter` | JSON Formatter, Base64 |
| `developer` | UUID, Hash, Color, Cipher |
| `text` | Word Counter, Case Converter |
| `image` | Resize, Compress |
| `utility` | Password, Number Base |

### HTML Apps
| Category | Contoh |
|----------|--------|
| Games | Snake, Tic Tac Toe |
| Tools | Calculator, Stopwatch |
| Productivity | Todo, Notes |

---

## 🎨 Styling

Gunakan semantic tokens:

```tsx
// ✅ Benar
className="bg-card text-foreground border-border"
className="bg-primary text-primary-foreground"

// ❌ Salah
className="bg-white text-black"
```

---

## 📱 Responsive

- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)  
- 💻 Desktop (> 1024px)

---

## 🔧 Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router

---

Made with ❤️ using [Lovable](https://lovable.dev)
