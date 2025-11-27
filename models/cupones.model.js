import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Cupon extends Model {}

Cupon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        codigo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        descuento_porcentaje: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        usos_maximos: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
    },
    { sequelize, modelName: "cupones", timestamps: false }
);

export default Cupon;
