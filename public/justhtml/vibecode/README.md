# VibeDev v7 - Modular Chat Application

Aplikasi chat AI berbasis React yang modular dengan dukungan multiple model AI dan analytics.

## 📁 Struktur Proyek

```
vibecode/
├── index.html                 # Entry point HTML
├── css/
│   └── styles.css            # Stylesheet utama
└── js/
    ├── tailwind.config.js    # Konfigurasi Tailwind CSS
    ├── config.js             # Konfigurasi model & API
    ├── database.js           # IndexedDB storage handler
    ├── app.js                # Main application logic
    └── components/
        ├── AnalyticsModal.js # Modal analytics komponen
        ├── Markdown.js       # Markdown renderer
        ├── Thinking.js       # Thinking accordion
        └── MessageFooter.js  # Message metadata footer
```

## ✨ Fitur Utama

### 1. **Modular Architecture**
- Pemisahan file HTML, CSS, dan JavaScript
- Komponen React yang terorganisir
- Mudah di-maintain dan dikembangkan

### 2. **Export & Copy Chat**
- **Copy Chat** - Salin seluruh percakapan ke clipboard
- **Copy Individual Message** - Salin pesan spesifik (user/AI) dengan hover
- **Download Markdown** - Export sebagai file .md dengan syntax highlighting
- **Download Text** - Export sebagai plain text .txt
- Toast notification untuk feedback

### 3. **Konfigurasi Base URL API**
- Setting custom base URL API
- Disimpan di localStorage
- Default: `https://api.vibe-dev.web.id/v1`

### 4. **Multi Model Support**
- Claude Sonnet 4.5
- Claude Sonnet 4.5 (Thinking)
- Claude Opus 4.5 (Thinking)
- Gemini 3 Pro Preview
- Gemini 3 Flash Preview
- Gemini 2.5 Flash

### 5. **Analytics Dashboard**
- Tracking penggunaan per model
- Cost calculation otomatis
- Token usage statistics

### 6. **Persistent Storage**
- IndexedDB untuk chat history
- localStorage untuk konfigurasi
- Auto-save conversations

### 7. **Responsive Design**
- Mobile-first approach
- Sidebar drawer untuk mobile
- Touch-friendly interface

## 🚀 Cara Menggunakan

1. **Buka aplikasi** di browser
2. **Klik pengaturan** di sidebar
3. **Masukkan API Key** Anda
4. **(Opsional) Set Base URL** jika menggunakan endpoint custom
5. **Mulai chat** dengan memilih model AI
6. **Export chat** dengan klik tombol download di navbar

## 📤 Cara Export Chat

### Dari Navbar
1. Klik tombol **Download** (ikon download) di navbar
2. Pilih format export:
   - **Copy Chat** - Salin seluruh percakapan ke clipboard
   - **Download Markdown** - File .md dengan formatting
   - **Download Text** - File .txt plain text

### Copy Individual Message
1. **Mobile**: Tombol copy selalu terlihat di bawah setiap pesan
2. **Desktop**: Hover pada pesan untuk menampilkan tombol copy
3. Klik tombol **Copy** (biru) atau **Copied!** (hijau)
4. **Animasi visual** akan muncul:
   - Button membesar (scale animation)
   - Icon berubah menjadi check mark ✓ dengan slide-in effect
   - Background button berubah dari biru ke hijau
   - Toast notification "✓ Copied!" muncul dari bawah
5. **Hanya konten pesan** yang akan tersalin (tanpa header [USER]/[ASSISTANT] dan metadata)
6. Tombol memiliki label "Copy" / "Copied!" di desktop (tersembunyi di mobile untuk hemat space)

### Format Export

**Markdown (.md)**
- Formatting rich text dengan syntax highlighting
- Thinking process dalam collapsible sections
- Metadata (model, tokens, cost) ditampilkan
- Cocok untuk dokumentasi dan sharing

**Text (.txt)**
- Plain text tanpa formatting
- Mudah dibaca di text editor apapun
- Thinking process dalam section terpisah
- Metadata dalam format simple

**Copy to Clipboard**
- Format plain text
- Langsung bisa paste ke aplikasi lain
- Termasuk semua metadata dan thinking

## ⚙️ Konfigurasi

### API Key
Masukkan API key Anda di settings panel. Key akan disimpan di localStorage.

### Base URL API
Default endpoint: `https://api.vibe-dev.web.id/v1`

Untuk mengubah:
1. Buka Settings
2. Edit field "Base URL API"
3. Masukkan URL custom Anda (tanpa `/chat/completions`)
4. Perubahan disimpan otomatis

### Model Registry
Edit `js/config.js` untuk menambah/mengubah model:

```javascript
const MODEL_REGISTRY = {
    'model-id': {
        name: 'Model Name',
        in: 3.00,    // Input price per 1M tokens
        out: 15.00,  // Output price per 1M tokens
        color: 'text-blue-400'
    }
};
```

## 🛠️ Pengembangan

### Menambah Komponen Baru

1. Buat file baru di `js/components/`
2. Export komponen ke `window` object:
```javascript
const MyComponent = ({ props }) => {
    // Component code
};
window.MyComponent = MyComponent;
```

3. Import di `index.html`:
```html
<script type="text/babel" src="js/components/MyComponent.js"></script>
```

4. Gunakan di `app.js`:
```javascript
<window.MyComponent props={value} />
```

### Menambah Fitur Database

Edit `js/database.js` dan tambahkan method baru:

```javascript
const db = {
    // Existing methods...

    customMethod: async (params) => {
        const d = await db.open();
        return new Promise(res => {
            // Your logic here
        });
    }
};
```

## 🎨 Styling

### Custom Scrollbar
```css
.custom-scrollbar::-webkit-scrollbar { /* ... */ }
```

### Theme Colors
Menggunakan Tailwind CSS dengan custom colors:
- `bg-dark-bg` - Background utama
- `bg-dark-surface` - Surface/card
- `bg-dark-border` - Border color
- `bg-brand-primary` - Primary action color

### Responsive Breakpoints
- Mobile: Default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## 📊 Analytics

Analytics melacak:
- **Total Cost** - Biaya kumulatif semua request
- **Requests** - Jumlah API calls
- **Tokens** - Input + output tokens
- **Per-model breakdown** - Detail usage per model

## 🔒 Security

- API Key disimpan di localStorage (client-side only)
- Tidak ada server-side logging
- Semua komunikasi via HTTPS
- Validasi input untuk mencegah XSS

## 📱 Mobile Optimization

- Touch-friendly UI elements (min 44px tap targets)
- Prevent iOS zoom with `font-size: 16px`
- Responsive drawer sidebar
- Auto-resize textarea
- Smooth scrolling

## 🐛 Troubleshooting

### Chat tidak terkirim
- Pastikan API Key sudah diisi
- Cek Base URL API sudah benar
- Lihat console browser untuk error details

### Komponen tidak muncul
- Pastikan `lucide.createIcons()` dipanggil
- Cek urutan script import di `index.html`
- Verify component sudah di-export ke `window`

### Database error
- Clear IndexedDB via browser DevTools
- Refresh halaman
- Cek browser compatibility (needs IndexedDB support)

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

Kontribusi welcome! Struktur modular memudahkan kolaborasi:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push dan create PR

## 📞 Support

Untuk issues dan pertanyaan, buka issue di repository.
