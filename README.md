# Better With You - Website

## 🚀 How to Run Locally

### Method 1: Using the included Python server (Easiest)

```bash
cd /path/to/outputs
python server.py
```

Then open: http://localhost:8000

### Method 2: Python's built-in server

```bash
cd /path/to/outputs
python -m http.server 8000
```

Then open: http://localhost:8000

### Method 3: Node.js

```bash
cd /path/to/outputs
npx serve
```

or just run from index.html

### Method 4: PHP (if installed)

```bash
cd /path/to/outputs
php -S localhost:8000
```

---

## 📁 Project Structure

```
outputs/
├── index.html          # Home page
├── pages/              # Additional pages
│   ├── about.html
│   ├── events.html
│   ├── gallery.html
│   ├── artists.html
│   └── contact.html
├── css/                # Modular stylesheets
│   ├── base.css
│   ├── effects.css
│   ├── navigation.css
│   └── layout.css
└── js/                 # Modular scripts
    ├── navigation.js
    └── effects.js
```

## 🎨 Features

- Interactive fog effects with mouse interaction
- Pulsing corner lights
- Glassmorphic navigation menu
- Responsive design
- Parallax logo effect
- Multi-page navigation

---

Enjoy! 🎉
