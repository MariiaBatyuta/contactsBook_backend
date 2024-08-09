import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { userLogin, userLogout, userRegister } from "../controllers/userControllers.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, userRegister);
authRouter.post("/login", jsonParser, userLogin);
authRouter.post("/logout", authMiddleware, userLogout);

export default authRouter;