import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).send({ message: "Not authorized." });

    const [bearer, token] = authorizationHeader.split(' ', 2);
    if (bearer !== "Bearer") return res.status(401).send({ message: "Not authorized." });

    jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
        if (error) return res.status(401).send({ message: "Not authorized." });

        try {
            const user = await User.findById(decode.id);
            if (!user) return res.status(401).send({ message: "Not authorized." });
            if (user.token !== token) return res.status(401).send({ message: "Not authorized." });

            req.user = {
                id: decode.id,
                email: decode.id,
            };

            next();
        } catch (error) {
            next(error);
        }
    })
};