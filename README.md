# Rubi Study Hub Web - React TypeScript

A modern React web application built with TypeScript, Vite, and React Router.

## Tech Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **ESLint 9** - Code linting with flat config
- **highlight.js** - Syntax highlighting

## Features

- 🎨 Dark/Light theme switching
- 🌍 Multi-language support
- 📱 Responsive design
- 🔄 Context-based state management
- 🎯 Type-safe API layer
- 🚀 Fast development with HMR
- 📦 Modular architecture

## Project Structure

```
/
├── src/
│   ├── app/              # Core application setup
│   │   ├── App.tsx       # Main app component
│   │   ├── routes.tsx    # Route definitions
│   │   └── layouts/      # Layout components
│   ├── pages/            # Feature-based pages
│   ├── shared/           # Shared utilities and components
│   │   ├── components/   # Shared UI components
│   │   ├── contexts/     # React Context providers
│   │   ├── data/         # API layer and types
│   │   ├── hooks/        # Custom React hooks
│   │   └── ui/           # Generic UI components
│   └── assets/           # Static assets
├── public/               # Public assets
└── index.html            # HTML entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Development Server

The development server runs on `http://localhost:3003/rubi/` (or next available port) with:
- Hot Module Replacement (HMR)
- CORS enabled
- API proxy configured for `/v1` endpoints

## API Configuration

The application is configured to proxy API requests to `http://localhost:8080`. Update the proxy target in `vite.config.ts` to match your backend URL.

## Scripts

- `dev` - Start Vite development server
- `build` - Build for production (TypeScript check + Vite build)
- `lint` - Run ESLint with flat config
- `preview` - Preview production build locally

## License

MIT
