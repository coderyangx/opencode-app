/// <reference types="vite/client" />

import { AuthContextValue } from './lib/AuthContext';

declare global {
  const React: typeof import('react');
  const ReactDOM: typeof import('react-dom');
  interface Window {
    ctx: AuthContextValue;
  }
}

export {};
