import Joi from "joi";

export const userRegisterSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
});