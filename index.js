import express from "express";
import PlatosRouter from "./routes/platos.router.js";
import AuthRouter from "./routes/auth.router.js";
import PedidosRouter from "./routes/pedidos.router.js";
import CuponesRouter from "./routes/cupones.router.js";
import ImagenesRouter from "./routes/producto_imagenes.router.js";
// import models so they initialize and associations can be set
import "./models/platos.model.js";
import Usuario from "./models/usuarios.model.js";
import Pedido from "./models/pedidos.model.js";
import PlatoPedido from "./models/platos_x_pedidos.model.js";
import Cupon from "./models/cupones.model.js";
import ProductoImagen from "./models/producto_imagenes.model.js";
import { sequelize } from "./db.js";

// Associations
Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Many to many between platos and pedidos via PlatoPedido
import { Plato } from "./models/platos.model.js";
Plato.belongsToMany(Pedido, { through: PlatoPedido, foreignKey: "id_plato", otherKey: "id_pedido" });
Pedido.belongsToMany(Plato, { through: PlatoPedido, foreignKey: "id_pedido", otherKey: "id_plato" });

// Product images
Plato.hasMany(ProductoImagen, { foreignKey: "id_plato" });
ProductoImagen.belongsTo(Plato, { foreignKey: "id_plato" });

// Coupons
Cupon.hasMany(Pedido, { foreignKey: "cupon_id" });
Pedido.belongsTo(Cupon, { foreignKey: "cupon_id" });

// Ensure tables are created (safe in dev)
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized (sync alter)");
    } catch (err) {
        console.error("Error syncing database:", err);
    }
})();
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("BurgerTIC API is running..."));

app.use("/platos", PlatosRouter);
app.use("/auth", AuthRouter);
app.use("/pedidos", PedidosRouter);
app.use("/cupones", CuponesRouter);
app.use("/imagenes", ImagenesRouter);

app.listen(process.env.PORT || 9000, () =>
    console.log(`Server is running on port ${process.env.PORT || 9000}`)
);
