# BurgerTIC - Fullstack demo

This workspace contains a Node/Express backend and a Vite+React frontend implementing a burger shop demo with customizable burgers, images, coupons, QR order numbers, multi-language support and dark mode.

Quick start (development):

1. Copy .env.example to .env and set a Postgres DB URL and JWT secret.

2. Install backend dependencies and seed the DB:

```powershell
cd d:\Users\Charlie\Documents\GitHub\burgertic-2025
npm install
npm run seed
npm run dev
```

3. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend in your browser (usually http://localhost:5173). Use the seeded admin credentials: admin@burgertic.com / adminpass (the seed script hashes the password so you'll be able to login), and a normal user: jane@burgertic.com / 123456.

- Backend: Sequelize models (Plato, Usuario, Pedido, PlatoPedido, Cupon, ProductoImagen), REST endpoints for auth, products, orders, coupons and image management. JWT auth with token expiry, admin verification, order number & qr data generation.
Note: Orders now generate server-side QR images (PNG data URLs) so the front-end displays the QR immediately after placing an order.

Features implemented (high level):
- Backend: Sequelize models (Plato, Usuario, Pedido, PlatoPedido, Cupon, ProductoImagen), REST endpoints for auth, products, orders, coupons and image management. JWT auth with token expiry, admin verification, order number & qr data generation.
- Frontend: React app with Landing, Products, Product detail (customization), Cart & Checkout (delivery / takeaway / table), Order confirmation with QR code, Admin panel to create coupons and view orders. Multi-language (EN/ES/DE/FR/CN) and dark/light mode.
Admin panel: supports coupon creation and full product CRUD (create/edit/delete) and image management.

See `log.md` for the development history and file changes.
