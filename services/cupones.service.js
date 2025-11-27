import Cupon from "../models/cupones.model.js";

const createCupon = async (data) => {
    return await Cupon.create({
        codigo: data.codigo,
        descuento_porcentaje: data.descuento_porcentaje || 0,
        activo: data.activo !== undefined ? data.activo : true,
        usos_maximos: data.usos_maximos || null,
        fecha_vencimiento: data.fecha_vencimiento || null,
    });
};

const getCuponByCodigo = async (codigo) => {
    return await Cupon.findOne({ where: { codigo } });
};

const listCupones = async () => {
    return await Cupon.findAll();
};

const updateCupon = async (id, data) => {
    const c = await Cupon.findByPk(id);
    if (!c) throw new Error("Cupon no encontrado");
    Object.assign(c, data);
    await c.save();
    return c;
};

const deleteCupon = async (id) => {
    const c = await Cupon.findByPk(id);
    if (!c) throw new Error("Cupon no encontrado");
    await c.destroy();
};

export default { createCupon, getCuponByCodigo, listCupones, updateCupon, deleteCupon };
