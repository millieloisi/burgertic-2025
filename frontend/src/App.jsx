import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import OrderConfirmation from './pages/OrderConfirmation'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

function App() {
  const [dark, setDark] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    navigate('/')
  }

  return (
    <I18nextProvider i18n={i18n}>
      <div className="app-root">
        <header className="topbar">
          <div className="brand" onClick={() => navigate('/') }>
            <img src="/logo.svg" alt="BurgerTIC" className="logo" />
            <div>
              <div className="title">BurgerTIC Americana</div>
              <div className="tagline">The best american burgers experience</div>
            </div>
          </div>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/productos">Menu</Link>
            <Link to="/cart">Cart</Link>
            {token ? (
              <>
                <Link to="/admin">Admin</Link>
                <button className="btn small" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            <button className="btn small" onClick={() => setDark(d => !d)}>{dark ? 'Light' : 'Dark'}</button>
          </nav>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login onAuth={t => setToken(t)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/order/confirmation/:numero" element={<OrderConfirmation />} />
          </Routes>
        </main>

        <footer className="footer">© BurgerTIC — Built for demo. Multi-language, dark mode & customizable burgers.</footer>
      </div>
    </I18nextProvider>
  )
}

export default App
