
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register Service Worker for PWA (Add to Home Screen)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ใช้ relative path เพื่อความปลอดภัยในทุก environment
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('SW registered successfully'))
      .catch(err => console.warn('PWA Service Worker registration skipped (normal in sandbox/preview):', err.message));
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
