import CuponesService from "../services/cupones.service.js";

const createCupon = async (req, res) => {
    try {
        const { cupon } = req.body;
        if (!cupon || !cupon.codigo) return res.status(400).json({ message: "Faltan datos del cupón" });

        const exists = await CuponesService.getCuponByCodigo(cupon.codigo);
        if (exists) return res.status(400).json({ message: "Código de cupón ya existe" });

        const created = await CuponesService.createCupon(cupon);
        return res.status(201).json(created);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creando cupón" });
    }
};

const listCupones = async (req, res) => {
    try {
        const cupones = await CuponesService.listCupones();
        return res.status(200).json(cupones);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error obteniendo cupones" });
    }
};

const validateCupon = async (req, res) => {
    try {
        const { codigo } = req.params;
        const c = await CuponesService.getCuponByCodigo(codigo);
        if (!c) return res.status(404).json({ message: "Cupon no encontrado" });
        // basic validity checks
        if (!c.activo) return res.status(400).json({ message: "Cupon inactivo" });
        const today = new Date().toISOString().slice(0, 10);
        if (c.fecha_vencimiento && c.fecha_vencimiento < today) return res.status(400).json({ message: "Cupon vencido" });
        return res.status(200).json(c);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error validando cupón" });
    }
};

export default { createCupon, listCupones, validateCupon };
