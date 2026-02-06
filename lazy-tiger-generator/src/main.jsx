import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './i18n'; // Initialize i18n

import GuidePage from './pages/GuidePage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/create" element={<App />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
