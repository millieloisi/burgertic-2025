import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class ProductoImagen extends Model {}

ProductoImagen.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_plato: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(2048),
            allowNull: false,
        },
        alt: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    { sequelize, modelName: "producto_imagenes", timestamps: false }
);

export default ProductoImagen;
