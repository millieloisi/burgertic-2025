import ProductoImagen from "../models/producto_imagenes.model.js";

const addImage = async (id_plato, url, alt) => {
    return await ProductoImagen.create({ id_plato, url, alt });
};

const getImagesForPlato = async (id_plato) => {
    return await ProductoImagen.findAll({ where: { id_plato } });
};

const deleteImage = async (id) => {
    const img = await ProductoImagen.findByPk(id);
    if (!img) throw new Error("Imagen no encontrada");
    await img.destroy();
};

export default { addImage, getImagesForPlato, deleteImage };
