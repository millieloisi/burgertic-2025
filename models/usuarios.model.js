import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "usuarios",
        timestamps: false,
    }
);

export default Usuario;
