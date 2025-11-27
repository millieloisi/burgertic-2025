import PedidosService from "../services/pedidos.service.js";

const getPedidos = async (req, res) => {
    try {
        const pedidos = await PedidosService.getPedidos();
        return res.status(200).json(pedidos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al obtener pedidos" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener todos los pedidos
            2. Devolver un json con los pedidos (status 200)
            3. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const getPedidosByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const pedidos = await PedidosService.getPedidosByUser(userId);
        return res.status(200).json(pedidos || []);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al obtener pedidos del usuario" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener los pedidos del usuario
            2. Si el usuario no tiene pedidos, devolver una lista vacía (status 200)
            3. Si el usuario tiene pedidos, devolver un json con los pedidos (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const getPedidoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await PedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        return res.status(200).json(pedido);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al obtener pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, devolver un json con el pedido (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const createPedido = async (req, res) => {
    try {
        const body = req.body;
        if (!body || !body.platos) return res.status(400).json({ message: "Faltan platos" });
        if (!Array.isArray(body.platos) || body.platos.length === 0) return res.status(400).json({ message: "El campo platos debe ser un array con al menos un elemento" });

        for (const pp of body.platos) {
            if (!pp.id || !pp.cantidad) return res.status(400).json({ message: "Cada plato debe tener id y cantidad" });
        }

        const userId = req.user.id;

        const pedido = await PedidosService.createPedido(userId, body.platos, { cupon: body.cupon });

        return res.status(201).json(pedido);
    } catch (err) {
        console.error(err);
        if (err.message && err.message.includes("no existe")) return res.status(400).json({ message: err.message });
        return res.status(500).json({ message: "Error al crear pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el body de la request tenga el campo platos
            2. Verificar que el campo productos sea un array
            3. Verificar que el array de productos tenga al menos un producto
            4. Verificar que todos los productos tengan un id y una cantidad
            5. Si algo de lo anterior no se cumple, devolver un mensaje de error (status 400)
            6. Crear un pedido con los productos recibidos y el id del usuario (utilizando el servicio de pedidos)
            7. Devolver un mensaje de éxito (status 201)
            8. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const aceptarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await PedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "pendiente") return res.status(400).json({ message: "El pedido debe estar en estado 'pendiente' para aceptar" });
        await PedidosService.updatePedido(id, "aceptado");
        return res.status(200).json({ message: "Pedido aceptado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al aceptar pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "pendiente"
            4. Si el pedido no está en estado "pendiente", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "pendiente", actualizar el estado del pedido a "aceptado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const comenzarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await PedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "aceptado") return res.status(400).json({ message: "El pedido debe estar en estado 'aceptado' para comenzar" });
        await PedidosService.updatePedido(id, "en camino");
        return res.status(200).json({ message: "Pedido en camino" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al cambiar estado del pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "aceptado"
            4. Si el pedido no está en estado "aceptado", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "aceptado", actualizar el estado del pedido a "en camino"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const entregarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await PedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        if (pedido.estado !== "en camino") return res.status(400).json({ message: "El pedido debe estar en estado 'en camino' para entregar" });
        await PedidosService.updatePedido(id, "entregado");
        return res.status(200).json({ message: "Pedido entregado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al entregar pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "en camino"
            4. Si el pedido no está en estado "en camino", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "en camino", actualizar el estado del pedido a "entregado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const deletePedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await PedidosService.getPedidoById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        await PedidosService.deletePedido(id);
        return res.status(200).json({ message: "Pedido eliminado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al eliminar pedido" });
    }
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, eliminar el pedido
            4. Devolver un mensaje de éxito (status 200)
            5. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

export default {
    getPedidos,
    getPedidosByUser,
    getPedidoById,
    createPedido,
    aceptarPedido,
    comenzarPedido,
    entregarPedido,
    deletePedido,
};
