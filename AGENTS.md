# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for AI agents working in this codebase.

## Project Overview

- **Project Name**: my-react-app
- **Type**: React SPA with Vite
- **Framework**: React 19 + React Router 7
- **Build Tool**: Vite 7
- **Language**: JavaScript/JSX

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Run ESLint on all files
```

### Testing
- No test framework is currently configured.
- To add tests, consider installing Vitest or Jest.

## Code Style Guidelines

### General Rules
- Use **single quotes** for strings in JSX and JavaScript
- Use **2 spaces** for indentation
- Use **PascalCase** for component names
- Use **camelCase** for variables and functions
- Use **UPPER_SNAKE_CASE** for constants
- Add **one blank line** between imports and code

### Imports
- Use **named imports** for React hooks and router
- Group imports: external libs first, then internal components, then CSS
- Use absolute imports from `src/` for internal modules
- Example:
  ```jsx
  import { useState, useEffect } from 'react';
  import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
  import Modal from '../components/Modal';
  import './App.css';
  ```

### Components
- Use **function components** with arrow functions or function declarations
- Use **React.lazy()** with dynamic import for route components (code splitting)
- Use **Suspense** with fallback for lazy-loaded components
- Example:
  ```jsx
  const Home = lazy(() => import('./pages/Home'));
  
  function App() {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>...</Routes>
      </Suspense>
    );
  }
  ```

### State Management
- Use **useState** for local component state
- Use **useEffect** for side effects
- Ensure all hooks have proper dependency arrays

### Styling
- Use **CSS classes** from App.css for consistent styling
- Use **inline styles** sparingly for dynamic values only
- Class names should be **kebab-case** (e.g., `modal-content`, `home-page`)

### Error Handling
- Use **conditional rendering** for optional UI (e.g., `if (!props.show) return null`)
- Add TODO comments for incomplete code: `// TODO: description`
- Handle loading states with fallback components

### ESLint Configuration
The project uses ESLint with these rules:
- React Hooks recommended config
- React Refresh for HMR
- No unused variables (except those starting with underscore)
- Dist folder is ignored

Run `npm run lint` before committing to ensure code quality.

## File Structure
```
src/
├── App.jsx           # Main app with router
├── App.css           # Global styles
├── main.jsx          # Entry point
├── index.css         # Additional styles
├── components/       # Reusable components
│   └── Modal.jsx
└── pages/            # Route pages
    ├── Home.jsx
    └── About.jsx
```

## Best Practices
1. Always run `npm run lint` before finishing any task
2. Use lazy loading for page components
3. Keep components small and focused
4. Use meaningful variable and function names
5. Add comments only when necessary for complex logic
