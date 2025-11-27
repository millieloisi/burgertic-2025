import Pedido from "../models/pedidos.model.js";
import PlatoPedido from "../models/platos_x_pedidos.model.js";
import { Plato } from "../models/platos.model.js";
import Cupon from "../models/cupones.model.js";
import { sequelize } from "../db.js";

const getPlatosByPedido = async (idPedido) => {
    return await PlatoPedido.findAll({ where: { id_pedido: idPedido }, include: [{ model: Plato }] });
};

const getPedidos = async () => {
    return await Pedido.findAll({ include: [{ model: Plato, through: { attributes: ["cantidad", "customizaciones"] } }] });
};

const getPedidoById = async (id) => {
    return await Pedido.findByPk(id, { include: [{ model: Plato, through: { attributes: ["cantidad", "customizaciones"] } }, { model: Cupon }] });
};

const getPedidosByUser = async (idUsuario) => {
    return await Pedido.findAll({ where: { id_usuario: idUsuario }, include: [{ model: Plato, through: { attributes: ["cantidad", "customizaciones"] } }, { model: Cupon }] });
};

const createPedido = async (idUsuario, platos, opts = {}) => {
    // platos = [{ id, cantidad, customizaciones? }, ...]
    if (!Array.isArray(platos) || platos.length === 0) throw new Error("productos inválidos");

    return await sequelize.transaction(async (t) => {
        // validate all platos exist and compute total
        let total = 0;
        for (const p of platos) {
            const plato = await Plato.findByPk(p.id);
            if (!plato) throw new Error(`Plato con id ${p.id} no existe`);
            total += (plato.precio || 0) * (p.cantidad || 1);
        }

        // Optionally apply coupon
        let cupon_id = null;
        if (opts.cupon) {
            const c = await Cupon.findOne({ where: { codigo: opts.cupon, activo: true } });
            if (c) {
                cupon_id = c.id;
                if (c.descuento_porcentaje) total = total * (1 - c.descuento_porcentaje / 100);
            }
        }

        const numero = `ORD-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
        // Create a small JSON payload for the qr and generate a PNG data URL server-side
        const qrPayload = { numero, idUsuario, created: new Date().toISOString() };
        let qr_data = JSON.stringify(qrPayload);
        try {
            const QRCode = (await import('qrcode')).default;
            // Generate dataURL PNG for QR so frontend can display it immediately
            const dataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), { width: 300 });
            qr_data = dataUrl; // store the data URL in the DB
        } catch (err) {
            // fallback to JSON payload (we still store data so frontends can parse it)
            console.warn('QR code generation failed:', err);
        }

        const created = await Pedido.create({ id_usuario: idUsuario, numero_pedido: numero, qr_data, total, cupon_id }, { transaction: t });

        // create platos_x_pedidos rows
        for (const p of platos) {
            await PlatoPedido.create({ id_pedido: created.id, id_plato: p.id, cantidad: p.cantidad || 1, customizaciones: p.customizaciones || null }, { transaction: t });
        }

        return await getPedidoById(created.id);
    });
};

const updatePedido = async (id, estado) => {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    pedido.estado = estado;
    await pedido.save();
    return pedido;
};

const deletePedido = async (id) => {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    await PlatoPedido.destroy({ where: { id_pedido: id } });
    await pedido.destroy();
};

export default {
    getPlatosByPedido,
    getPedidos,
    getPedidoById,
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
};
