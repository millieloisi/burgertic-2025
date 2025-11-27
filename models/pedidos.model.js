import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Pedido extends Model {}

Pedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "pendiente",
        },
        metodo_entrega: {
            type: DataTypes.ENUM("delivery", "takeaway", "mesa"),
            allowNull: false,
            defaultValue: "takeaway",
        },
        numero_mesa: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numero_pedido: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        qr_data: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        cupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    { sequelize, modelName: "pedidos", timestamps: false }
);

export default Pedido;
