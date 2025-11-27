import React from 'react'

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero container">
        <div className="left">
          <h1>Welcome to BurgerTIC — The American Burger Experience</h1>
          <p className="lead">Craft your perfect burger with fresh ingredients, choose combos, sides and drinks. Fast pickup, delivery and table service — we'll give you a QR and number to collect your order.</p>

          <div className="hero-actions">
            <a href="/productos" className="btn primary">Order Now</a>
            <a href="/admin" className="btn">Admin Panel</a>
          </div>

          <div style={{display:'flex',gap:12, marginTop:18}}>
            <div style={{padding:12, borderRadius:8, background:'linear-gradient(90deg, rgba(255,255,255,0.03), transparent)'}}>
              <div style={{fontWeight:700, color:'var(--accent)'}}>10min</div>
              <div className="muted">Avg. pickup time</div>
            </div>
            <div style={{padding:12, borderRadius:8, background:'linear-gradient(90deg, rgba(255,255,255,0.03), transparent)'}}>
              <div style={{fontWeight:700, color:'var(--accent-2)'}}>4.9★</div>
              <div className="muted">Customer rating</div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="visual">
            <img src="https://images.unsplash.com/photo-1541542684-66b6f73c5f9f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b8e6c93be5a3d1b41d9ca38c6e43f66" alt="Burger hero" />
          </div>
        </div>
      </section>

      <section className="container showcase" style={{marginTop:26}}>
        <div className="feature card" style={{padding:18}}>
          <h3>Beautiful designs</h3>
          <p>Professional layout, gorgeous palette and high quality imagery to make the food irresistible.</p>
        </div>
        <div className="feature card" style={{padding:18}}>
          <h3>Order & Pickup</h3>
          <p>Every order receives a QR and number to collect at the counter. Delivery and table pickup supported.</p>
        </div>
        <div className="feature card" style={{padding:18}}>
          <h3>Coupons & Admin tools</h3>
          <p>Admins can create coupons, manage products and orders. Customers can apply coupons during checkout to save on orders.</p>
        </div>
      </section>
    </div>
  )
}

export default Landing
