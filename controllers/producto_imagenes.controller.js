import ImagenesService from "../services/producto_imagenes.service.js";

const addImage = async (req, res) => {
    try {
        const { id_plato, url, alt } = req.body;
        if (!id_plato || !url) return res.status(400).json({ message: "id_plato y url son obligatorios" });
        const created = await ImagenesService.addImage(id_plato, url, alt);
        return res.status(201).json(created);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error agregando imagen" });
    }
};

const getImages = async (req, res) => {
    try {
        const { id_plato } = req.params;
        const imgs = await ImagenesService.getImagesForPlato(id_plato);
        return res.status(200).json(imgs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error obteniendo imágenes" });
    }
};

const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        await ImagenesService.deleteImage(id);
        return res.status(200).json({ message: "Imagen eliminada" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error eliminando imagen" });
    }
};

export default { addImage, getImages, deleteImage };
