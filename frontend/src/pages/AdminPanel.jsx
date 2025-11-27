import React, { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const AdminPanel = () => {
  const [cupon, setCupon] = useState({ codigo: '', descuento_porcentaje: 10 })
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState({ tipo: 'principal', nombre: '', precio: 0, descripcion: '' })
  const [imageUrl, setImageUrl] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    api.get('/pedidos', { headers: { Authorization: `Bearer ${token}` } }).then(r => setOrders(r.data)).catch(e => console.error(e))
    api.get('/platos').then(r => setProducts(r.data)).catch(e => console.error(e))
  }, [token])

  const createCupon = async () => {
    if (!token) return alert('Please login as admin')
    try {
      const resp = await api.post('/cupones', { cupon }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Cupon created')
    } catch (err) {
      alert(err.response?.data?.message || 'Error')
    }
  }

  const createProduct = async () => {
    if (!token) return alert('Please login as admin')
    try {
      if (productForm.editingId) {
        await api.put(`/platos/${productForm.editingId}`, productForm, { headers: { Authorization: `Bearer ${token}` } })
        alert('Product updated')
      } else {
        await api.post('/platos', productForm, { headers: { Authorization: `Bearer ${token}` } })
        alert('Product created')
      }
      const r = await api.get('/platos'); setProducts(r.data)
      setProductForm({ tipo: 'principal', nombre: '', precio: 0, descripcion: '' })
      setProductForm(prev => ({ ...prev, editingId: null }))
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product')
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete product?')) return
    try {
      await api.delete(`/platos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const startEdit = (p) => {
    setProductForm({ tipo: p.tipo, nombre: p.nombre, precio: p.precio, descripcion: p.descripcion, editingId: p.id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addImage = async (id_plato) => {
    if (!token) return alert('Please login as admin')
    try {
      await api.post('/imagenes', { id_plato, url: imageUrl, alt: 'admin-add' }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Image added')
      setImageUrl('')
    } catch (err) { alert(err.response?.data?.message || 'Image add failed') }
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="panel-grid">
        <section className="card">
          <h3>Create coupon</h3>
          <label>Code <input value={cupon.codigo} onChange={e => setCupon({ ...cupon, codigo: e.target.value })} /></label>
          <label>Discount % <input value={cupon.descuento_porcentaje} onChange={e => setCupon({ ...cupon, descuento_porcentaje: e.target.value })} /></label>
          <button className="btn primary" onClick={createCupon}>Create</button>
        </section>

        <section className="card">
          <h3>Products</h3>
          <div className="form" style={{marginBottom:12}}>
            <label>Tipo
              <select value={productForm.tipo} onChange={e=>setProductForm({...productForm, tipo: e.target.value})}>
                <option value="principal">principal</option>
                <option value="combo">combo</option>
                <option value="postre">postre</option>
              </select>
            </label>
            <label>Nombre <input value={productForm.nombre} onChange={e=>setProductForm({...productForm, nombre:e.target.value})} /></label>
            <label>Precio <input type="number" value={productForm.precio} onChange={e=>setProductForm({...productForm, precio:parseFloat(e.target.value)})} /></label>
            <label>Descripcion <input value={productForm.descripcion} onChange={e=>setProductForm({...productForm, descripcion:e.target.value})} /></label>
            <div><button className="btn primary" onClick={createProduct}>Create product</button></div>
          </div>

          <h3>Product list</h3>
          {products.length === 0 ? <p>No products</p> : (
            <ul className="orders-list">
              {products.map(p => (
                <li key={p.id} className="order-item">
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>
                      <strong>{p.nombre}</strong> — {p.tipo} — ${p.precio}
                      <div className="muted">{p.descripcion}</div>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn" onClick={()=>startEdit(p)}>Edit</button>
                      <button className="btn" onClick={()=>deleteProduct(p.id)}>Delete</button>
                    </div>
                  </div>
                  <div style={{marginTop:6}}>
                    <input placeholder="Image URL" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
                    <button className="btn" onClick={()=>addImage(p.id)}>Add Image</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3>All orders</h3>
          {orders.length === 0 ? <p>No orders</p> : (
            <ul className="orders-list">
              {orders.map(o => (
                <li key={o.id} className="order-item">
                  <div><strong>{o.numero_pedido}</strong> — Usuario {o.id_usuario} — Estado: {o.estado} — Total: ${o.total}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminPanel
