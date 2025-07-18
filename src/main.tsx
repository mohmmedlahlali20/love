import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  throw new Error("Root element not found");
}
