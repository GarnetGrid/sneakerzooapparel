# SNEAKER ZOO & APPAREL - TECHNICAL MANUAL
**Version:** 21.0 (Kinetic Upgrade)
**Date:** February 6, 2026

## 1. System Overview
Sneaker Zoo is a high-fidelity, single-page-application (SPA-lite) e-commerce experience built on Vanilla JS, HTML5, and CSS3. It utilizes a class-based architecture (`script.js`) to manage state, navigation, and DOM injection, eliminating the need for heavy frameworks while delivering a "premium" app-like feel.

### Core Philosophy: "Deep Void"
- **Visuals**: Dark mode (#050505) with high-contrast text and holographic accents (#E0E0E0).
- **Typography**: `Syne` (Headlines) and `Plus Jakarta Sans` (Body).
- **Interaction**: Custom cursor physics and magnetic button fields.

---

## 2. File Structure

### Core Files
- `index.html`: The Landing Page. Features the "WALK WITH POWER" typographic hero.
- `showcase.html`: The Archive. A dynamic grid that consumes `data.js` to render products.
- `product.html`: The Object Analysis. A split-screen detail page with Three.js integration.
- `cart.html` / `checkout.html`: The Commerce Protocol. Persistent cart management.
- `account.html`: The Access Portal. Mock login/registration system.

### Logic Modules
- `script.js`: The central engine containing `App`, `CartManager`, and `AuthManager`.
- `data.js`: The JSON inventory database (Footwear, Apparel, Objects).
- `styles.css`: The "Deep Void" design system source.

---

## 3. The Bespoke Engine (`script.js`)

The application is driven by a single global instance: `window.app = new App()`.

### Class: `App`
Orchestrates the lifecycle of every page load.
- **`initHeader()`**: Dynamically injects the global navigation bar and handles scroll hiding.
- **`initShowcase()`**: Renders the product grid and handles category filtering.
- **`initProduct()`**: Parses URL parameters (`?id=xyz`) to hydrate the product template.
- **`initCursor()`**: Manages the custom dot-and-ring cursor physics.

### Class: `CartManager`
Handles the commerce logic.
- **Persistence**: Sinc's cart data to `localStorage` key `sz_cart`.
- **Methods**: `addItem(item)`, `removeItem(index)`, `updateCount()`.
- **Feedback**: Triggers the custom Toast Notification system.

### Class: `AuthManager`
Handles the mock authentication system.
- **Persistence**: Syncs user profile to `localStorage` key `sz_user`.
- **Methods**: `login(user, pass)`, `register(user, email)`, `logout()`.
- **State**: Updates the Header "ACCESS" button to show the active user (e.g., `// NEO`).

---

## 4. Design System (`styles.css`)

### Color Palette
| Variable | Value | Usage |
| :--- | :--- | :--- |
| `--bg` | `#050505` | Main Background (Void) |
| `--text` | `#FFFFFF` | Primary Text |
| `--hologram` | `#E0E0E0` | Accents, Borders, Hovers |
| `--void` | `#000000` | Deep contrast elements |

### UI Components
- **`.btn-magnet`**: A button that pulls towards the cursor on hover.
- **`.card-glass`**: A product card with a translucent background and blur effect.
- **`.grid-container`**: A standardized 12-column CSS grid layout.

---

## 5. Development Workflow
To run this project locally:
1.  **Clone** the repository.
2.  **Serve**: Due to Three.js security policies, you must use a local server.
    *   `npx http-server .` or `python3 -m http.server`
3.  **Access**: Navigate to `localhost:8080`.

> **Note**: This project uses **Git** for version control. Ensure you commit all changes to `data.js` if modifying inventory.
