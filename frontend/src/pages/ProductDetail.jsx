import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

// 🔥 FIX: reemplazar process.env por import.meta.env
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const defaultExtras = [
  { key: 'bacon', label: 'Bacon', price: 50 },
  { key: 'cheese', label: 'Extra Cheese', price: 40 },
  { key: 'onion', label: 'Caramelized Onion', price: 25 },
  { key: 'avocado', label: 'Avocado', price: 60 }
]

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [extras, setExtras] = useState({})

  useEffect(() => {
    api.get(`/platos/${id}`)
      .then(r => setP(r.data[0] || r.data))
      .catch(console.error)
  }, [id])

  const toggleExtra = (key) =>
    setExtras(e => ({ ...e, [key]: !e[key] }))

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const chosenExtras = Object.entries(extras)
      .filter(([_, v]) => v)
      .map(([k]) => k)

    cart.push({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: qty,
      extras: chosenExtras
    })

    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/cart')
  }

  if (!p) return <div>Loading...</div>

  return (
    <div className="product-detail">
      <div className="detail-grid card" style={{padding:18}}>
        <img
          className="hero-img"
          src={`https://picsum.photos/seed/${p.id}/800/500`}
          alt={p.nombre}
        />

        <div>
          <h2 style={{margin:0}}>{p.nombre}</h2>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div className="muted">{p.tipo}</div>
            <div className="price-tag">${Math.round(p.precio || 0)}</div>
          </div>
          <p>{p.descripcion}</p>

          <div className="customization" style={{marginTop:14}}>
            <h4>Customize</h4>
            {defaultExtras.map(e => (
              <label key={e.key} className="checkbox">
                <input
                  type="checkbox"
                  checked={!!extras[e.key]}
                  onChange={() => toggleExtra(e.key)}
                />
                {e.label} (+${e.price})
              </label>
            ))}
          </div>

          <div className="actions" style={{display:'flex',gap:12,alignItems:'center',marginTop:18}}>
            <label>
              Quantity  
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(parseInt(e.target.value || 1))}
              />
            </label>
            <button className="btn primary" onClick={addToCart}>
              Add to cart
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail
