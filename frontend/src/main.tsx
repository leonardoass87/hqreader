import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Leitor from './Leitor.tsx'
import DescricaoManga from './pages/DescricaoManga.tsx'
import LoginAdmin from './pages/LoginAdmin.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manga/:id" element={<DescricaoManga />} />
        <Route path="/leitor/:id/:capituloId" element={<Leitor />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
