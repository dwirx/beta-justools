---
name: justtools-app-builder
description: Buat app React/TSX di src/apps/ dan HTML di public/justhtml/ dengan metadata terbaru (addedAt), siap sort/filter, responsive mobile+desktop.
---

# JusTools App Builder

Tulis kode aplikasi ke jalur berikut:
- **React/TSX**: `/home/hades/project/beta/beta-justools/src/apps/`
- **HTML**: `/home/hades/project/beta/beta-justools/public/justhtml/`

---

## 🎯 Cara Pakai

### User: "Buat HTML hello-world"
→ Tulis ke: `public/justhtml/hello-world.html`

### User: "Buat React hello-world"
→ Tulis ke: `src/apps/HelloWorld.tsx`

**Langsung tulis kode. Auto-detected oleh registry.**

---

## 🆕 Wajib Ikuti Sistem Terbaru

### 1) Metadata tanggal untuk urutan terbaru/terlama
Gunakan `addedAt` format `YYYY-MM-DD` agar app bisa diurutkan:
- `Urutkan: Terbaru`
- `Urutkan: Terlama`

React/TSX:
```tsx
export const appMeta = {
  name: 'Nama App',
  description: 'Deskripsi singkat',
  category: 'Tools' as const,
  icon: '🧩',
  featured: false,
  addedAt: '2026-02-12',
};
```

HTML:
- Tambahkan/ubah metadata di `src/lib/appRegistry.ts` bagian `htmlCustomizations`.
- Isi `addedAt` untuk app HTML agar ikut sort tanggal.

### 2) Filter harus tetap rapi
App baru harus kompatibel dengan filter:
- Search (nama + deskripsi)
- Category
- Type (`React/TSX` atau `HTML`)

Pastikan nama, deskripsi, category, dan type jelas agar hasil filter akurat.

### 3) Responsive wajib (mobile + desktop)
Setiap app harus usable di:
- Mobile (>= 320px)
- Tablet
- Desktop

Minimal standar responsive:
- Gunakan layout fleksibel (`flex`, `grid`, `max-w-*`, `w-full`)
- Hindari ukuran fixed yang merusak layar kecil
- Gunakan breakpoint Tailwind (`sm:`, `md:`, `lg:`)
- Pastikan tombol/target sentuh nyaman di mobile
- Pastikan teks tidak overflow di layar kecil

---

## 📝 Template

### React App (Single File)
```tsx
// src/apps/HelloWorld.tsx
export const appMeta = {
  name: 'Hello World',
  description: 'Contoh app React yang responsive',
  category: 'Education' as const,
  icon: '👋',
  featured: false,
  addedAt: '2026-02-12',
};

export default function HelloWorld() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Hello World!
      </h1>
    </div>
  );
}
```

### React App (Folder - untuk app kompleks)
```tsx
// src/apps/my-game/index.tsx
export default function MyGame() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <h1>My Game</h1>
    </div>
  );
}
```

### HTML App (Single File)
```html
<!-- public/justhtml/hello-world.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
    }
    h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
```

### HTML App (Folder - untuk app kompleks)
```html
<!-- public/justhtml/my-game/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>My Game</h1>
  <script src="game.js"></script>
</body>
</html>
```

---

## ✅ Aturan

**React:**
- TypeScript + React
- Indentasi: 2 spasi
- Import: `@/` untuk `src/` → `import { Button } from '@/components/ui/button'`
- Tailwind: `bg-background`, `text-foreground`
- Naming: PascalCase file (`HelloWorld.tsx`) atau kebab-case folder (`hello-world/index.tsx`)
- Gunakan `appMeta` + `addedAt` jika memungkinkan

**HTML:**
- HTML5 + CSS + JavaScript
- Naming: kebab-case (`hello-world.html` atau `hello-world/index.html`)
- Untuk urutan tanggal, isi `addedAt` di `htmlCustomizations` (`src/lib/appRegistry.ts`)

**Verifikasi sebelum selesai:**
- Cek tampil di homepage dan/atau My Apps
- Cek sort `Terbaru`/`Terlama`
- Cek filter search/category/type
- Cek layout di mobile + desktop
