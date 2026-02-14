# Sneaker Zoo & Apparel - Unified Archive (v21)

> **Phase 21: Kinetic Upgrade // Accounts & Commerce**

A bespoke, high-performance e-commerce experience for **Sneaker Zoo & Apparel**, a premium sneaker boutique in Staten Island, NY. This repository hosts the complete v21 overhaul, featuring a custom design engine, persistent cart/account logic, and a minimalist "Object Analysis" interface.

---

## 🎨 Design System: "UNIFIED"

*   **Aesthetic**: Future-Industrial / Void Minimalist.
*   **Typography**:
    *   **Headers**: `Syne` (Extra Bold, Art-house).
    *   **Body**: `Plus Jakarta Sans` (Geometric, High Legibility).
*   **Palette**:
    *   `--void`: `#050505` (Deep Black Background)
    *   `--hologram`: `#E0E0E0` (Silver Text/Accents)
    *   `--accent`: `#FF3333` (Interaction Red)
*   **Interactions**:
    *   **Magnetic Buttons**: Phys-based cursor attraction.
    *   **Ghost Cursor**: Custom JS-driven dot/ring follower.
    *   **Glassmorphism**: 2% opacity surfacing with blurred backdrops.

---

## 🏗️ Architecture

### Core Pages
| Page | Function | Key Features |
| :--- | :--- | :--- |
| **`index.html`** | **Hero / Entry** | Massive typographic scaling, hidden navigation, immersive entry. |
| **`showcase.html`** | **The Archive** | 12-column grid system, glass cards, "Cart" state tracking. |
| **`product.html`** | **Object Analysis** | Split-screen (50/50) layout, raw visual focus, specs panel. |
| **`privacy.html`** | **Protocol** | Rebranded legal copy, minimalist readable layout. |
| **`terms.html`** | **Service Terms** | High-contrast typographic legal layout. |

### Core Engine
*   **`styles.css`**: The "Bespoke" stylesheet. No frameworks (Bootstrap/Tailwind removed). Pure CSS variables.
*   **`script.js`**: `class App { ... }` state management. Handles cursor physics, scroll detection, and header blend modes.

---

## 🚀 Setup & Deployment

### 1. Local Development
This project is static HTML/CSS/JS. No build step required.

```bash
# Serves at localhost:8000
python3 -m http.server
```

### 2. Assets
*   Images are referenced as placeholders or local assets in `assets/`.
*   Fonts are served via Google Fonts CDN (Syne + Plus Jakarta).

---

## 📜 Credits & License
**© 2026 Sneaker Zoo & Apparel.**
Designed & Engineered by Garnet Grid Consulting.
*Staten Island, New York.*

> "WALK WITH POWER."
