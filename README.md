# 🛍️ Prova Store

A modern, full-featured product store application built with React. This project demonstrates real-world state management patterns using **Context API + useReducer**, **Redux Toolkit**, and **React Query** together in one cohesive app.

---

## 📸 Overview

Prova Store lets users browse hundreds of real products, filter by category, search, sort, view in grid or list layout, see product details with reviews, and manage a persistent shopping cart — all with a polished dark-mode-capable UI.

## Screenshots(desktop + mobile)

<div align="center">
    <table align="center">
    <tr align="center">
    <td align="center">
    <h3>Desktop View</h3>
    <a href="https://github.com/parvanehyaghoubi/ProvaStore/blob/main/public/screenshot-desktop-dark.png">
    <img src="https://raw.githubusercontent.com/parvanehyaghoubi/ProvaStore/main/public/screenshot-desktop-dark.png" height=200px>
    </a>
</td>
      <td align="center">
    <h3>Desktop View</h3>
    <a href="https://github.com/parvanehyaghoubi/ProvaStore/blob/main/public/screenshot-desktop-light.png">
    <img src="https://raw.githubusercontent.com/parvanehyaghoubi/ProvaStore/main/public/screenshot-desktop-light.png" height=200px>
    </a>
</td>
<td  align="center">
    <h3>Mobile View</h3>
    <a href="https://github.com/parvanehyaghoubi/ProvaStore/blob/main/public/screenshot-mobile-dark.png">
    <img src="https://raw.githubusercontent.com/parvanehyaghoubi/ProvaStore/main/public/screenshot-mobile-dark.png" height=200px>
    </a>
    </td>
      <td  align="center">
    <h3>Mobile View</h3>
    <a href="https://github.com/parvanehyaghoubi/ProvaStore/blob/main/public/screenshot-mobile-light.png">
    <img src="https://raw.githubusercontent.com/parvanehyaghoubi/ProvaStore/main/public/screenshot-mobile-light.png" height=200px>
    </a>
    </td>
    <tr>
    </table>
</div>

---

## ✨ Features

### 🌐 Product Browsing (React Query)
- Fetches live product data from the [DummyJSON API](https://dummyjson.com)
- Skeleton loading placeholders while data is being fetched
- Error state with user-friendly message
- **Pagination** — 12 products per page
- **Search** products by name in real-time
- **Filter** by category (dynamically loaded from API)
- **Sort** by price (asc/desc), name, or rating
- Cached queries — revisiting the same page doesn't re-fetch

### 📄 Product Details (React Query)
- Full product detail page with image gallery
- Display specs, tags, warranty, shipping info
- Existing customer reviews
- **Submit a review** (mutation with `useMutation`)

### 🛒 Shopping Cart (Redux Toolkit)
- Add / remove items
- Increase / decrease item quantity
- Clear entire cart
- Live total price calculation (with 10% tax)
- **Persisted to localStorage** — cart survives page refreshes
- Item count badge on navbar icon

### 🎨 App Settings (Context API + useReducer)
- **Dark / Light mode** toggle — synced to `<html>` class and localStorage
- **Grid / List view** toggle — persisted to localStorage
- **Category selection** — shared across components without prop drilling
- **Search query** — accessible anywhere in the tree
- **Sort preference** — globally available

### 🔔 UX Extras
- Toast notifications for cart actions (react-hot-toast)
- Smooth animations (fade-in, slide-up, scale-in)
- Fully responsive layout
- React Query Devtools (development only)

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Cart/
│   │   └── CartPage.jsx          # Cart UI with item controls & order summary
│   ├── Navbar/
│   │   └── Navbar.jsx            # Sticky nav with theme toggle & cart badge
│   ├── ProductCard/
│   │   └── ProductCard.jsx       # Grid & list card variants
│   ├── ProductDetails/
│   │   └── ProductDetails.jsx    # Full detail page with image gallery & review form
│   ├── ProductList/
│   │   ├── ProductList.jsx       # Paginated product grid/list with sort
│   │   └── ProductToolbar.jsx    # Search, sort, view toggle, category pills
│   ├── Settings/
│   │   └── SettingsPage.jsx      # App preferences panel
│   └── UI/
│       └── ProductSkeleton.jsx   # Shimmer loading placeholders
├── context/
│   └── AppContext.jsx            # Context API + useReducer (theme, layout, filters)
├── hooks/
│   └── useProducts.js            # React Query hooks (useProducts, useProduct, useCategories, useSubmitReview)
├── pages/
│   └── HomePage.jsx              # Home page wrapper
├── store/
│   ├── slices/
│   │   └── cartSlice.js          # Redux Toolkit slice with selectors
│   └── store.js                  # Redux store configuration
├── App.jsx                       # Root: providers, router, toaster
├── index.js                      # React entry point
└── index.css                     # Tailwind directives + custom utilities
```

---

## 🛠️ Tools & Libraries

| Tool | Purpose |
|---|---|
| **React 18** | UI library with functional components & hooks |
| **React Router v6** | Client-side routing |
| **Redux Toolkit** | Cart state management |
| **react-redux** | `useSelector`, `useDispatch` hooks |
| **@tanstack/react-query v5** | Server state, fetching, caching, mutations |
| **Context API + useReducer** | App-wide settings (theme, view, filters) |
| **Tailwind CSS v3** | Utility-first styling with dark mode |
| **react-hot-toast** | Toast notification system |
| **DummyJSON API** | Free fake products REST API |

---

## 🏗️ State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                            │
│                                                             │
│  ┌──────────────────────┐   ┌──────────────────────────┐   │
│  │   Context API +      │   │    Redux Toolkit         │   │
│  │   useReducer         │   │    (redux store)         │   │
│  │                      │   │                          │   │
│  │  • theme             │   │  cartSlice               │   │
│  │  • viewMode          │   │  • items[]               │   │
│  │  • selectedCategory  │   │  • addToCart()           │   │
│  │  • searchQuery       │   │  • removeFromCart()      │   │
│  │  • sortBy            │   │  • increaseQuantity()    │   │
│  │                      │   │  • decreaseQuantity()    │   │
│  │  Stored in:          │   │  • clearCart()           │   │
│  │  localStorage        │   │                          │   │
│  └──────────────────────┘   │  Stored in:              │   │
│                             │  localStorage            │   │
│  ┌──────────────────────┐   └──────────────────────────┘   │
│  │   React Query        │                                   │
│  │                      │                                   │
│  │  useProducts()       │                                   │
│  │  useProduct(id)      │                                   │
│  │  useCategories()     │                                   │
│  │  useSubmitReview()   │                                   │
│  │                      │                                   │
│  │  Cached in:          │                                   │
│  │  in-memory cache     │                                   │
│  └──────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

### Why each tool is used where:

- **Context + useReducer** → UI preferences that many components need to read but rarely change. Avoids prop drilling without the overhead of Redux for non-business-critical state.
- **Redux Toolkit** → Cart is complex business state: multiple actions, derived values (totals, counts), needs to be accessible from many disconnected components.
- **React Query** → Server data has its own lifecycle (loading, error, cache, stale). React Query handles all of it declaratively and prevents redundant network requests.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/parvanehyaghoubi/ProvaStore.git
cd product-store

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

Output goes to the `build/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 📡 API

This project uses the free [DummyJSON Products API](https://dummyjson.com/docs/products):

| Endpoint | Used for |
|---|---|
| `GET /products?limit=12&skip=N` | Paginated product list |
| `GET /products/search?q=...` | Product search |
| `GET /products/category/:name` | Category filter |
| `GET /products/:id` | Product detail page |
| `GET /products/category-list` | All category names |
| `POST /comments/add` | Mock review submission |

No API key required.

---

## 🎨 Design Decisions

- **Warm amber palette** (`brand-500: #f1701e`) — friendly, energetic, non-generic
- **Playfair Display** for headings, **DM Sans** for body — editorial + modern combination
- **Dark mode** implemented via Tailwind's `darkMode: 'class'` strategy
- **Grid/List toggle** gives users control over information density
- Cards use **subtle elevation** (shadow + border) rather than heavy boxes
- Animations are **fast and purposeful** (200–400ms) — not decorative noise

---

## 📝 License

MIT — feel free to use this as a reference or starting point for your own projects.

## Contact
For any inquiries, please contact:
- parvaneh.yaghoubi77@gmail.com


## Links

### Parvaneh Yaghoubi
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-three-flax-hqnvbkqkq6.vercel.app/)

[![linkedin Badge](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/parvaneh-yaghoubi-54362620b)


<div align="center">
  <sub>Made with ❤️ by <a href="https://parvaneh-yaghoubi.github.io/Portfolio/">Parvaneh</a></sub>
</div>
