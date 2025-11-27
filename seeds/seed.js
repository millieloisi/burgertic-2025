import "dotenv/config";
import { sequelize } from "../db.js";
import { Plato } from "../models/platos.model.js";
import Usuario from "../models/usuarios.model.js";
import Pedido from "../models/pedidos.model.js";
import PlatoPedido from "../models/platos_x_pedidos.model.js";
import Cupon from "../models/cupones.model.js";
import ProductoImagen from "../models/producto_imagenes.model.js";

const run = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("DB synced (force)");

        // Create admin and user
        // hash the passwords for seeded users
        const bcrypt = (await import('bcryptjs')).default;
        const adminPass = await bcrypt.hash('adminpass', 10);
        const userPass = await bcrypt.hash('123456', 10);

        const admin = await Usuario.create({ nombre: "Admin", apellido: "Root", email: "admin@burgertic.com", password: adminPass, admin: true });
        const user = await Usuario.create({ nombre: "Jane", apellido: "Doe", email: "jane@burgertic.com", password: userPass, admin: false });

        // Create platos
        const productos = [
            { tipo: "principal", nombre: "Classic Burger", precio: 450, descripcion: "Two patties, lettuce, tomato, cheese" },
            { tipo: "principal", nombre: "BBQ Bacon Burger", precio: 520, descripcion: "Smoky BBQ sauce and crispy bacon" },
            { tipo: "principal", nombre: "Double Cheese", precio: 560, descripcion: "Double cheese melt" },
            { tipo: "combo", nombre: "Classic Combo", precio: 700, descripcion: "Burger + fries + drink" },
            { tipo: "combo", nombre: "Family Pack", precio: 1600, descripcion: "4 burgers + 4 fries + 4 drinks" },
            { tipo: "postre", nombre: "Milkshake Chocolate", precio: 180, descripcion: "Creamy chocolate milkshake" },
            { tipo: "postre", nombre: "Apple Pie", precio: 120, descripcion: "Warm apple pie" },
            { tipo: "principal", nombre: "Veggie Deluxe", precio: 430, descripcion: "Plant-based patty with avocado" },
            { tipo: "principal", nombre: "Spicy Wings", precio: 350, descripcion: "Hot & crispy" },
            { tipo: "postre", nombre: "Donut Trio", precio: 150, descripcion: "Three mini donuts" },
        ];

        const createdPlatos = [];
        for (const p of productos) createdPlatos.push(await Plato.create(p));

        // Add images for each product
        for (const p of createdPlatos) {
            await ProductoImagen.create({ id_plato: p.id, url: `https://picsum.photos/seed/${p.id}/600/400`, alt: p.nombre });
        }

        // Create a coupon
        await Cupon.create({ codigo: "WELCOME10", descuento_porcentaje: 10, activo: true });

        // Create 2 orders
        const o1 = await Pedido.create({ id_usuario: user.id, numero_pedido: `ORD-TEST-1`, qr_data: JSON.stringify({ numero: "ORD-TEST-1", usuario: user.id }), total: 1000, estado: "pendiente", metodo_entrega: "takeaway" });
        await PlatoPedido.create({ id_pedido: o1.id, id_plato: createdPlatos[0].id, cantidad: 2, customizaciones: { quitar: ["tomate"], agregar: ["cebolla caramelizada"] } });

        const o2 = await Pedido.create({ id_usuario: user.id, numero_pedido: `ORD-TEST-2`, qr_data: JSON.stringify({ numero: "ORD-TEST-2", usuario: user.id }), total: 520, estado: "aceptado", metodo_entrega: "mesa", numero_mesa: 5 });
        await PlatoPedido.create({ id_pedido: o2.id, id_plato: createdPlatos[1].id, cantidad: 1 });

        console.log("Seed data created successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
