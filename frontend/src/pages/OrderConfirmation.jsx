import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// 🔥 FIX: usar import.meta.env en lugar de process.env
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const OrderConfirmation = () => {
  const { numero } = useParams()
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    // Prefer the last stored order (Cart stores last_order). Otherwise try backend lookup.
    const last = JSON.parse(localStorage.getItem('last_order') || 'null')

    if (last && last.numero_pedido === numero) {
      setPedido(last)
      return
    }

    api.get('/pedidos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => {
        const found = r.data.find(o => o.numero_pedido === numero)
        setPedido(found || { numero_pedido: numero })
      })
      .catch(() => setPedido({ numero_pedido: numero }))
  }, [numero])

  if (!pedido) return <div>Loading...</div>

  return (
    <div className="order-confirm card" style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>Order confirmed</h2>
          <div className="muted">Show this QR & number at pickup</div>
        </div>

        <div style={{textAlign:'right'}}>
          <div className="muted">Order number</div>
          <div style={{fontSize:20, fontWeight:800}}>{pedido.numero_pedido}</div>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:24,marginTop:18}}>
        <div className="qr">
          {pedido.qr_data && typeof pedido.qr_data === 'string' && pedido.qr_data.startsWith('data:image') ? (
            <img src={pedido.qr_data} alt="QR" style={{ width: 220, height: 220, borderRadius:12, boxShadow:'0 6px 18px rgba(0,0,0,0.25)' }} />
          ) : (
            <div className="no-qr" style={{padding:12, borderRadius:8, background:'var(--glass)'}}>
              <p style={{margin:0}}>QR not available</p>
            </div>
          )}
        </div>

        <div style={{flex:1}}>
          <h3 style={{marginTop:0}}>Thank you — your order is being processed</h3>
          <p className="muted">Bring the QR and the above number to pick up your order. If you chose delivery or table service, follow the instructions shown.</p>

          <div style={{display:'flex',gap:10, marginTop:10}}>
            <button className="btn">Track order</button>
            <button className="btn primary" onClick={()=>window.location.href='/'}>Order again</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
