# CRM Pro - Modern Customer Relationship Management

A modern, feature-rich CRM application built with React, TypeScript, and Tailwind CSS. This is a complete rewrite of the original Flask-based CRM, transformed into a blazing-fast single-page application with a beautiful UI and enhanced functionality.

![CRM Pro Dashboard](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Modules
- **📊 Dashboard** - Interactive charts, KPI cards, pipeline visualization, and quick stats
- **👥 Contacts** - Full contact management with search, filtering, and company associations
- **🏢 Companies** - Company profiles with contact tracking and status management
- **💼 Deals** - Drag-and-drop Kanban pipeline with 6 stages and real-time value calculations
- **📅 Activities** - Timeline view with completion tracking, overdue alerts, and type filtering
- **📧 Email Templates** - Template library with preview, copy-to-clipboard, and variable support
- **🎯 Events** - Event management with RSVP tracking and type categorization

### New Features (vs Original)
- 🌓 **Dark Mode** - Full dark theme support with persistent preference
- 🔍 **Global Search** - Cross-entity search with instant results
- 🎨 **Modern UI** - Responsive design with smooth animations and transitions
- 📱 **Mobile-First** - Fully responsive layout with collapsible sidebar
- 💾 **Local Storage** - No backend required, data persists in browser
- 📊 **Interactive Charts** - Recharts-powered pipeline and distribution visualizations
- 🔄 **Drag & Drop** - Kanban board with drag-and-drop deal movement
- ⚡ **Instant Navigation** - SPA architecture with React Router

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jherney/crm.git
cd crm

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## 🏗️ Architecture

### Tech Stack
- **React 18.2** - UI framework
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4.1** - Utility-first styling
- **React Router 6** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Vite** - Build tool and dev server

### Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout with sidebar and header
├── pages/
│   ├── Dashboard.tsx       # Dashboard with charts and stats
│   ├── Contacts.tsx        # Contact management
│   ├── Companies.tsx       # Company management
│   ├── Deals.tsx           # Deal pipeline (Kanban + List)
│   ├── Activities.tsx      # Activity timeline
│   ├── Templates.tsx       # Email templates
│   └── Events.tsx          # Event management
├── store/
│   └── index.ts            # State management with localStorage
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
└── index.css               # Global styles
```

### Data Model

The CRM manages the following entities:

- **Contact**: first_name, last_name, email, phone, title, status, tags, notes, company_id
- **Company**: name, industry, website, email, phone, address, status, tags, notes
- **Deal**: name, value, currency, stage, probability, expected_close_date, contact_id, company_id
- **Activity**: type (call/email/meeting/task/note), subject, body, due_date, completed, deal_id, contact_id, company_id
- **EmailTemplate**: name, subject, body, category
- **Event**: title, description, start_date, end_date, location, type, rsvps

### Deal Pipeline Stages

1. **Prospect** (10% probability) - Initial contact
2. **Qualified** (25% probability) - Qualified lead
3. **Proposal** (50% probability) - Proposal sent
4. **Negotiation** (75% probability) - In negotiation
5. **Closed Won** (100% probability) - Deal won
6. **Closed Lost** (0% probability) - Deal lost

## 🎨 Features in Detail

### Dashboard
- Pipeline value and weighted forecast
- Won revenue tracking
- Contact and company counts
- Interactive bar chart for pipeline by stage
- Pie chart for deal distribution
- Upcoming activities feed
- Quick stats (win rate, avg deal size, pending activities)

### Deals Pipeline
- **Kanban View**: Drag-and-drop cards between stages
- **List View**: Traditional table view with sorting
- Real-time stage value calculations
- Color-coded stages
- Contact and company associations
- Expected close date tracking

### Activities
- Timeline view with completion checkboxes
- Overdue activity highlighting (red border)
- Type-based color coding and icons
- Filter by type (call, email, meeting, task, note)
- Show/hide completed activities
- Associations with deals, contacts, and companies

### Email Templates
- Template library with categories
- Preview modal
- Copy-to-clipboard functionality
- Variable placeholders: `{{first_name}}`, `{{company}}`, etc.
- Search and filter by category

### Dark Mode
- Toggle between light and dark themes
- Preference persisted in localStorage
- Smooth transitions
- Applied to all components

### Global Search
- Search across contacts, companies, and deals
- Instant results with navigation
- Keyboard shortcut hint (⌘K)

## 💾 Data Persistence

All data is stored in the browser's localStorage under the key `crm_data`. This means:
- ✅ No backend required
- ✅ Works offline
- ✅ Instant performance
- ⚠️ Data is per-browser (not synced across devices)
- ⚠️ Clearing browser data will reset the CRM

### Reset Demo Data
Click "Reset Demo Data" in the sidebar to restore the initial seed data.

## 🔧 Configuration

### Vite Configuration
The app uses Vite with the following plugins:
- `@vitejs/plugin-react` - React support
- `@tailwindcss/vite` - Tailwind CSS integration

### TypeScript
Strict mode enabled with comprehensive type definitions for all entities.

### Tailwind CSS
Using Tailwind v4 with dark mode support via the `dark` class strategy.

## 📦 Deployment

### GitHub Pages
```bash
# Add to vite.config.js:
#   base: '/crm/'

npm run build
git add dist -f
git subtree push --prefix dist origin gh-pages
```

### Vercel
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Docker (Optional)
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🆚 Comparison with Original Flask CRM

| Feature | Original (Flask) | New (React) |
|---------|------------------|-------------|
| Architecture | Server-side rendering | Single-page application |
| Backend | Python/Flask + SQLAlchemy | None (localStorage) |
| Database | SQLite/PostgreSQL | Browser localStorage |
| UI Framework | Jinja2 + basic CSS | React + Tailwind CSS |
| Charts | None | Recharts (interactive) |
| Dark Mode | No | Yes |
| Drag & Drop | No | Yes (Kanban) |
| Mobile Responsive | Basic | Full responsive design |
| Search | Per-module | Global cross-entity |
| Performance | Server round-trips | Instant (client-side) |
| Deployment | Requires Python server | Static files (any CDN) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original Flask CRM by [jherney](https://github.com/jherney)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI inspiration from modern CRM platforms

## 📞 Support

For issues and questions, please [open an issue](https://github.com/jherney/crm/issues) on GitHub.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
