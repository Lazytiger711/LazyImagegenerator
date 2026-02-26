import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './i18n'; // Initialize i18n

import GuidePage from './pages/GuidePage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'

const inFigmaIframe = typeof parent !== 'undefined' && parent !== window && parent.postMessage !== undefined;
console.log('Figma Environment Detected:', inFigmaIframe);
const Router = inFigmaIframe ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/create" element={<App />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
