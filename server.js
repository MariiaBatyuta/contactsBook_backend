import "dotenv/config";
import "./db/db.js";

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/authRoutes.js";
import contactsRouter from "./routes/contactsRoutes.js";

const app = express();
const swaggerDocumentation = JSON.parse(fs.readFileSync(path.resolve("./swagger.json"), 'utf-8'));

app.use(cors());

app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.get("api/warm-up", (req, res, next) => {
    try {
        res.status(200).send({message: "Server is warmed up. You can use the web."})
    } catch (error) {
        next(error);
    }
});

app.use((_, res) => {
    res.status(400).send({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    const { status = 500, message = "Server error" } = error;
    res.status(status).send({ message });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running. Use our API on port ${port}.`);
})