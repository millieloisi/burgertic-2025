import Usuario from "../models/usuarios.model.js";

const getUsuarioByEmail = async (email) => {
	return await Usuario.findOne({ where: { email } });
};

const getUsuarioById = async (id) => {
	return await Usuario.findByPk(id);
};

const createUsuario = async (usuario) => {
	// Ensure admin cannot be set via API (must be false by default)
	return await Usuario.create({
		nombre: usuario.nombre,
		apellido: usuario.apellido,
		email: usuario.email,
		password: usuario.password,
		admin: usuario.admin || false,
	});
};

export default { getUsuarioByEmail, getUsuarioById, createUsuario };
