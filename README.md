# DataUtil

DataUtil is a SaaS utility platform that provides fast, privacy-first online tools across PDF, image, text, developer, calculator, converter, and business domains.

## Current Status

✅ **Phase 1 Setup Complete**
- Project documentation created
- Angular 22.0.0 frontend scaffolded
- Development server running on http://localhost:4200/

## Tech Stack

### Frontend
- **Framework**: Angular 22.0.0 (latest)
- **Node.js**: 26.4.0
- **Package Manager**: npm 11.17.0
- **TypeScript**: 6.0.2
- **SSR**: Enabled with @angular/ssr and Express
- **Styling**: SCSS (Tailwind CSS & Angular Material - to be configured)
- **Testing**: Vitest

### Backend (Planned)
- ASP.NET Core Web API
- PostgreSQL database
- Azure Blob Storage for file processing

### Hosting (Planned)
- Frontend: Cloudflare Pages
- Backend: Azure App Service
- CI/CD: GitHub Actions

## Repository Structure

```
/
├── docs/                # Project documentation
│   ├── SRS.md          # Software Requirements Specification
│   ├── ARCHITECTURE.md  # System architecture design
│   └── MVP_BACKLOG.md  # Phase 1 feature backlog
├── frontend/           # Angular application (✅ created)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md           # This file
```

## Quick Start

### Frontend Development

```bash
cd frontend
ng serve
```

Open http://localhost:4200/ in your browser.

### Next Steps

1. Configure Tailwind CSS for utility-first styling
2. Install and configure Angular Material
3. Create core layout components (header, footer, navigation)
4. Implement routing structure for categories and tools
5. Build landing page with hero section and featured tools
6. Set up backend API project structure

## Documentation

- [Software Requirements Specification](docs/SRS.md) - Complete project requirements
- [System Architecture](docs/ARCHITECTURE.md) - Technical architecture and design decisions
- [MVP Backlog](docs/MVP_BACKLOG.md) - Phase 1 implementation tasks
- [Frontend README](frontend/README.md) - Angular app specific documentation

## Project Goals

Build the largest online collection of fast, secure, privacy-first utility tools with exceptional user experience:
- ⚡ Fast loading (< 2 sec)
- 📱 Mobile-first design
- 🎨 Modern UI/UX
- 🔍 SEO optimized
- 🔒 Privacy focused
- 📈 Highly scalable

## Version

**v1.0** - Planning and initial setup phase
