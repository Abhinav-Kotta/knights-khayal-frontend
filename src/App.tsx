import { useState, useEffect, ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import Members from './components/Members'
import Performances from './components/Performances'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import MemberForm from './pages/MemberForm'
import './App.css'

// Main website component
function MainWebsite() {
  console.log("MainWebsite function executed")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("useEffect running")
    // Simulate loading assets
    setTimeout(() => {
      console.log("Setting isLoading to false")
      setIsLoading(false)
    }, 2000)
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-title">Knights Khayal</h1>
          <p className="loading-subtitle">Dreaming in melody...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="members"><Members /></section>
        <section id="performances"><Performances /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}

// Protected route component with TypeScript types
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null
  
  if (!isAuthenticated) {
    // Store the current path so we can redirect back after login
    const currentPath = window.location.pathname
    localStorage.setItem('adminRedirectUrl', currentPath)
    return <Navigate to="/admin/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  console.log("App component rendered")
  
  return (
    <Router>
      <Routes>
        {/* Main website route */}
        <Route path="/" element={<MainWebsite />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/members/new" 
          element={
            <ProtectedRoute>
              <MemberForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/members/edit/:id" 
          element={
            <ProtectedRoute>
              <MemberForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to main website */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App