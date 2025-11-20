## Product Dashboard

ProductDash is a full-stack dashboard builder that pairs a React + Vite client with a lightweight Express-style API. It showcases reusable dashboard widgets, a widget library, and utility hooks for building modern product analytics surfaces.

## Tech Stack
- Client: React, TypeScript, Vite, Tailwind CSS, shadcn/ui components
- Server: TypeScript, Express-style router, Drizzle ORM
- Tooling: pnpm/npm scripts, PostCSS, ESLint, TSConfig path aliases

## Getting Started
```bash
npm install
npm run dev        # starts both client + server via Vite
```

## Project Structure
- `client/`: React application source, including widgets, hooks, and pages
- `server/`: API entry point, routes, and local storage layer
- `shared/`: Shared schema definitions between client and server
- `design_guidelines.md`: Notes on UX & UI patterns used throughout the app

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build client assets
- `npm run preview`: Preview production build

## Contributing
1. Fork and clone the repo
2. Create a feature branch (`git checkout -b feature/name`)
3. Submit a PR with a clear summary and testing notes

## License
This project is provided as-is; customize licensing as needed for your organization.

