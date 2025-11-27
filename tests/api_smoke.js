import axios from 'axios'
import 'dotenv/config'

const base = process.env.BASE_URL || 'http://localhost:9000'

const run = async () => {
  try {
    console.log('GET /platos')
    const p = await axios.get(`${base}/platos`)
    console.log('platos count:', p.data.length)

    console.log('GET /platos/1')
    const p1 = await axios.get(`${base}/platos/1`)
    console.log('plato 1 ok', !!p1.data)

    console.log('GET /cupones/validate/WELCOME10')
    const c = await axios.get(`${base}/cupones/validate/WELCOME10`)
    console.log('cupon', c.data.codigo)

    console.log('GET /platos')
    // try create an order (login first)
    console.log('Login as seeded user (jane)')
    const login = await axios.post(`${base}/auth/login`, { email: 'jane@burgertic.com', password: '123456' })
    const token = login.data.token
    console.log('Token length', token?.length)

    console.log('Create order POST /pedidos')
    const order = await axios.post(`${base}/pedidos`, { platos: [{ id: 1, cantidad: 1 }] }, { headers: { Authorization: `Bearer ${token}` } })
    console.log('order created', !!order.data.numero_pedido, !!order.data.qr_data)

    console.log('Smoke done')
  } catch (err) {
    console.error('Smoke test failed', err.message)
    process.exit(1)
  }
}

run()
