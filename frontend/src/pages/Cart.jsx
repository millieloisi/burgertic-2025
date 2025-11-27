import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const Cart = () => {
  const [cart, setCart] = useState([])
  const [cupon, setCupon] = useState('')
  const [metodo, setMetodo] = useState('takeaway')
  const [mesa, setMesa] = useState('')
  const [token] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), [])

  const total = cart.reduce((s, item) => s + (item.precio || 0) * (item.cantidad || 1), 0)

  const createOrder = async () => {
    if (!token) return navigate('/login')

    const platos = cart.map(c => ({
      id: c.id,
      cantidad: c.cantidad,
      customizaciones: { extras: c.extras }
    }))

    try {
      const resp = await api.post(
        '/pedidos',
        { platos, cupon, metodo_entrega: metodo, numero_mesa: mesa },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const pedido = resp.data
      localStorage.removeItem('cart')
      localStorage.setItem('last_order', JSON.stringify(pedido))
      navigate(`/order/confirmation/${pedido.numero_pedido}`)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error creating order')
    }
  }

  const removeItem = (idx) => {
    const copy = [...cart]
    copy.splice(idx, 1)
    setCart(copy)
    localStorage.setItem('cart', JSON.stringify(copy))
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h2>Your Cart</h2>
        <div className="muted">{cart.length} items</div>
      </div>
      {cart.length === 0 ? (
        <p>Your cart is empty — go add a burger!</p>
      ) : (
        <div>
          <div className="cart-grid">
            {cart.map((c, i) => (
              <div key={i} className="cart-item">
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <img src={`https://picsum.photos/seed/${c.id}/100/80`} alt={c.nombre} style={{width:84,height:64,objectFit:'cover',borderRadius:8}} />
                  <div>
                    <strong>{c.nombre}</strong>
                    <div className="muted">Extras: {c.extras?.join(', ') || 'none'}</div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>${c.precio} x {c.cantidad} = ${c.precio * c.cantidad}</div>
                <div>
                  <button className="btn" onClick={() => removeItem(i)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout">
            <div className="row">
              <label>
                Coupon code
                <input value={cupon} onChange={e => setCupon(e.target.value)} />
              </label>

              <label>
                Delivery method
                <select value={metodo} onChange={e => setMetodo(e.target.value)}>
                  <option value="delivery">Delivery</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="mesa">Table service</option>
                </select>
              </label>

              {metodo === 'mesa' && (
                <label>
                  Table number
                  <input value={mesa} onChange={e => setMesa(e.target.value)} />
                </label>
              )}
            </div>

            <div className="summary">
              <div style={{fontSize:18,fontWeight:700}}>Total: ${Math.round(total)}</div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>alert('Add more items from menu')}>Continue shopping</button>
                <button className="btn primary" onClick={createOrder}>Place order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
