import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userLoginSchema, userRegisterSchema } from "../schemas/authSchemas.js";

export const userRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "To registration, you must provide all the necessary information about the user." });
    
    try {
        const { error } = userRegisterSchema.validate({ name, email, password });
        if (error) return res.status(400).send({ message: res.message });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(409).send({ message: "Email in use." });

        const passwordHash = await bcrypt.hash(password, 10);

        const createUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: passwordHash,
        });

        const token = jwt.sign({ id: createUser._id, email: createUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userWithToken = await User.findByIdAndUpdate(createUser._id, { token }, { new: true }).select('-password');

        res.status(201).send(userWithToken);
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (Object.keys(req.body).length === 0) return res.status(400).status({ message: "Email or password is wrong." });
    
    try {
        const { error } = userLoginSchema.validate({ email, password });
        if (error) return res.status(400).send({ message: req.message });
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).send({ message: "Email or password is wrong." });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).send({ message: "Email or password is wrong" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userWithToken = await User.findByIdAndUpdate(user._id, { token }, { new: true }).select('-password');

        res.status(200).send(userWithToken);
    } catch (error) {
        next(error);
    }
};

export const userLogout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized." });

        await User.findByIdAndUpdate(user._id, { token: null });

        res.status(200).send({ message: "Logout successful." });
    } catch (error) {
        next(error);
    }
};