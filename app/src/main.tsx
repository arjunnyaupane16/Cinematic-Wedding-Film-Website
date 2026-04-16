import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DetailPage } from './pages/DetailPage.tsx'
import { CustomCursor } from './components/wedding/CustomCursor'

function AppRoutes() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="route-transition">
      <CustomCursor />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/details/:slug" element={<DetailPage />} />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
