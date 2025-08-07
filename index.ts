import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/swagger";
/* ROUTE IMPORTS */
import dashboardRoutes from "./src/routes/dashboardRoutes";
import metaRoutes from "./src/routes/metaRoutes";
import itemRoutes from "./src/routes/itemRoutes";
import tagRoutes from "./src/routes/tagRoutes";
import collectionRoutes from "./src/routes/collectionRoutes";
import publicRoutes from "./src/routes/publicRoutes";
import metricsRoutes from "./src/routes/metricsRoutes";
import barcodeRoutes from "./src/routes/barcodeRoutes";


/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Welcome to the Inventory Management API");
});
app.use("/popular-products", dashboardRoutes); // legacy
app.use("/meta", metaRoutes);
app.use("/items", itemRoutes);
app.use("/tags", tagRoutes);
app.use("/collections", collectionRoutes);
app.use("/public", publicRoutes);
app.use("/metrics", metricsRoutes);
app.use("/barcode", barcodeRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
