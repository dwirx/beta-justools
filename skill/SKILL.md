---
name: justtools-app-builder
description: Tulis kode React/TSX ke src/apps/ dan HTML ke public/justhtml/. Langsung tulis kode saja, auto-detected.
---

# JusTools App Builder

Tulis kode aplikasi ke:
- **React**: `/home/hades/project/beta/beta-justools/src/apps/`
- **HTML**: `/home/hades/project/beta/beta-justools/public/justhtml/`

---

## 🎯 Cara Pakai

### User: "Buat HTML hello-world"
→ Tulis ke: `public/justhtml/hello-world.html`

### User: "Buat React hello-world"
→ Tulis ke: `src/apps/HelloWorld.tsx`

**Langsung tulis kode, tidak perlu command atau registrasi!**

---

## 📝 Template

### React App (Single File)
```tsx
// src/apps/HelloWorld.tsx
export default function HelloWorld() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Hello World!</h1>
    </div>
  );
}
```

### React App (Folder - untuk app kompleks)
```tsx
// src/apps/my-game/index.tsx
export default function MyGame() {
  return (
    <div className="min-h-screen p-8">
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
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
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

**HTML:**
- HTML5 + CSS + JavaScript
- Naming: kebab-case (`hello-world.html` atau `hello-world/index.html`)
