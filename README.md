# ⛩️ AnimeVerse — The Next-Gen Immersive Anime Experience

<p align="center">
  <img src="./public/steel-ball-run-2560x1440-25586.jpg" alt="AnimeVerse Hero Banner" width="100%" style="border-radius: 16px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>An Awwwards-inspired, cinematic anime discovery platform built with WebGL 3D and physics-driven micro-interactions.</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-author--uk-msc-aspirant">Author</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Anime_Guide-Offline-8E75C2?style=for-the-badge&logo=google&logoColor=white" alt="Offline anime guide" />
  <img src="https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 🌟 Overview

**AnimeVerse** bridges the gap between static media databases and high-performance interactive web design. Instead of standard tabular listings, AnimeVerse delivers a cinematic journey featuring:

1. **Instant 0ms Data Architecture**: Stale-While-Revalidate caching with high-fidelity pre-cached seed data ensuring instant FCP (First Contentful Paint) with zero loading lag.
2. **In-App Media & OST Hub**: Embedded high-definition video trailer player with links to official soundtrack (OP/ED) searches on YouTube.
3. **Daily Episode Progress Tracker**: One-click episode counters with dynamic progress bars right on anime cards and detail pages.
4. **Weekly Airing Broadcast Schedule**: Monday-to-Sunday interactive simulcast schedule with live *"Airing Today"* indicators.
5. **Anime Versus Arena (`/compare`)**: Side-by-side head-to-head battle comparing ratings, episode pacing, and studio matchups.
6. **Anime Gallery & Virtual Museum**: Browse curated anime posters in the gallery or explore them in an interactive 3D museum.
7. **Anime Guide**: Instant, offline recommendations based on common anime moods and themes.

---

## 🚀 Key Features

### 🏛️ 1. Anime Gallery & Virtual Museum
* **Anime Gallery** (`/gallery`): Browse a responsive gallery of anime posters, ratings, and titles; switch between featured anime and your watchlist.
* **Virtual Museum** (`/museum`): Explore poster exhibits in an interactive 3D room and open any anime's details.

### 🤖 2. Anime Guide
* Instant, offline recommendations for popular anime moods and themes.
* Instant quick-prompt chips (*"🔥 Top Trending"*, *"🧠 Psychological Thrillers"*, *"🌸 Warm Romance"*, *"⚔️ Peak Shonen"*, *"⚡ Quick Binge"*).
* No API key or account required.

### 🔍 3. Advanced Filtering & Real-time Search
* Multi-parameter matrix: Filter simultaneously by **Type** (*TV, Movie, OVA*), **Status** (*Airing, Complete, Upcoming*), **Genre**, and **Sorting Criteria**.
* Browse by anime origin across the AniList catalog, with quick links for Japan, China, South Korea, and Taiwan.
* Debounced inputs with persistent recent searches and instant clearing.
* Region-aware JustWatch search links help check streaming catalogs; availability is not asserted by AnimeVerse.

### 📊 4. Watchlist Manager with Analytics
* Real-time metrics: Total Shows, Completed counter, Currently Watching tally, and Average Collection Rating.
* Full portability: Export entire watch history to `.json` or restore backups with zero server dependencies.

### 🎨 5. Adaptive Glassmorphism UI
* **Interactive Physics**: `react-parallax-tilt` 3D perspective transforms with gyro support.
* **Custom Dynamic Cursor**: Spring physics magnetic trailing cursor with auto-detection for clickable elements.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend Core** | React 18, React Router v6, Vite 5 |
| **3D & WebGL** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` |
| **Animation & Physics** | GSAP 3 (ScrollTrigger), Framer Motion 11, React Lenis, React Parallax Tilt |
| **Recommendations**| Curated offline anime guide |
| **Styling & Theming** | Tailwind CSS 3, PostCSS, Glassmorphism, CSS Custom Properties |
| **API & Networking** | Axios, AniList GraphQL API, throttled requests, and cached local fallbacks |

---

## 📁 Repository Structure

```
anime-verse/
├── public/                     # Static media, icons & manifests
├── src/
│   ├── components/             # Reusable modular UI components
│   │   ├── AIAnimeAssistant.jsx    # Offline anime recommendation widget
│   │   ├── AnimeCard.jsx           # 3D interactive tilt poster card
│   │   ├── AnimeMoodExplorer.jsx   # Mood-based genre discovery
│   │   ├── AnimeSlider.jsx         # Swiper.js touch carousel
│   │   ├── AnimeTimeline.jsx       # Era retrospective timeline
│   │   ├── CommandPalette.jsx      # Quick navigation (Ctrl + K)
│   │   ├── CustomCursor.jsx        # Trailing spring physics cursor
│   │   ├── Hero.jsx                # Cinematic entrance with canvas particles
│   │   ├── Navbar.jsx              # Backdrop-blur navigation with badge counters
│   ├── context/
│   ├── hooks/
│   │   ├── useLocalStorage.js      # Persistent state sync
│   │   └── useWatchlist.js         # Comprehensive watchlist manager
│   ├── pages/
│   │   ├── AnimeDetail.jsx         # Full metadata, trailer & cast
│   │   ├── Developer.jsx           # UK MSc applicant profile & tech stack
│   │   ├── Genres.jsx              # 32+ anime genre cards
│   │   ├── Gallery.jsx             # Featured and watchlist poster gallery
│   │   ├── Home.jsx                # Main portal & curated showcases
│   │   ├── Museum.jsx              # Interactive 3D anime museum
│   │   ├── Search.jsx              # Multi-faceted search matrix
│   │   └── Watchlist.jsx           # Personal library with bento stats
│   ├── utils/
│   │   └── animeApi.js             # Throttled & cached AniList GraphQL client
│   ├── App.jsx                     # Layout shell, Lenis scroll & routing
│   ├── index.css                   # Global design tokens & utility layers
│   └── main.jsx                    # Application entry
├── .env.example                # Sample environment variables
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18.x or later recommended)
- **pnpm**, **npm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kanizfatimakhan/anime-verse.git
   cd anime-verse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   No environment variables are required. The anime guide works offline. Never place private API keys in `VITE_*` variables because they are included in browser code.

4. **Launch Development Server:**
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```
   Open [http://localhost:5174](http://localhost:5174) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel (1-Click)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Root Directory: `./` (standard root).
4. No environment variables are required for the current app.
5. Click **Deploy**! The included Vercel rewrite serves the React app for direct links to client-side routes.

---

## 👩‍💻 Author

**Kaniz Fatima Khan**
* **Role**: Full-Stack Software Engineer & UI/UX Designer
* **LinkedIn**: [kaniz-fatima-khan-452841246](https://www.linkedin.com/in/kaniz-fatima-khan-452841246/)
* **GitHub**: [@Kanizfatimakhan](https://github.com/Kanizfatimakhan)

*Built as a showcase of frontend engineering, WebGL 3D design systems, and interactive anime discovery.*

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
