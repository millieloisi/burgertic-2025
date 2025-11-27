    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar si hay un token en los headers de autorización
            2. Verificar que el token esté en el formato correcto (Bearer <token>)
            3. Verificar que el token sea válido (utilizando la librería jsonwebtoken)
            4. Verificar que tenga un id de usuario al decodificarlo
    
        Recordar también que si sucede cualquier error en este proceso, deben devolver un error 401 (Unauthorized)
    */
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el id de usuario en la request es un administrador (utilizando el servicio de usuarios)
            2. Si no lo es, devolver un error 403 (Forbidden)
    
    */
import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ message: "No se proporcionó token" });

        const parts = auth.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ message: "Formato de token inválido" });

        const token = parts[1];

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
        } catch (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        if (!payload || !payload.id) return res.status(401).json({ message: "Token inválido" });

        const usuario = await UsuariosService.getUsuarioById(payload.id);
        if (!usuario) return res.status(401).json({ message: "Usuario no encontrado" });

        req.user = usuario;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        // The verifyToken middleware should already have set req.user
        const usuario = req.user;
        if (!usuario) return res.status(401).json({ message: "Unauthorized" });

        if (!usuario.admin) return res.status(403).json({ message: "Forbidden: admin required" });

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Forbidden" });
    }
};
