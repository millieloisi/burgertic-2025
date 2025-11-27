import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class PlatoPedido extends Model {}

PlatoPedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_pedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_plato: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        // customizaciones: JSON to store added/removed ingredients
        customizaciones: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "platos_x_pedidos",
        timestamps: false,
    }
);

export default PlatoPedido;
