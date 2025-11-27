import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

// 🔥 ESTA ES LA LÍNEA ARREGLADA
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const Products = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/platos')
      .then(r => setItems(r.data))
      .catch(console.error)
  }, [])

  return (
      <div>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between', gap:12}}>
          <h2 style={{margin:0}}>Menu</h2>
          <div className="muted">Delicious burgers, combos and desserts — customize your order</div>
        </div>
        <div className="product-grid">
        {items.map(p => (
          <div key={p.id} className="card product">
            <img
              src={
                p.producto_imagenes && p.producto_imagenes[0]
                  ? p.producto_imagenes[0].url
                  : `https://picsum.photos/seed/${p.id}/400/300`
              }
              alt={p.nombre}
            />

            <div className="card-body">
              <div className="meta">
                <div>
                  <h4 style={{margin:0}}>{p.nombre}</h4>
                  <div className="muted">{p.tipo}</div>
                </div>
                <div className="price-tag">${Math.round((p.precio || 0))}</div>
              </div>

              <p className="desc">{p.descripcion}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <Link to={`/productos/${p.id}`} className="btn small">Customize</Link>
                <Link to={`/productos/${p.id}`} className="btn primary small">Add to cart</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
