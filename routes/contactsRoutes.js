import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addNewContact, deleteContact, editContact, getAllContacts, getTheContact } from "../controllers/contactControllers.js";

const contactsRouter = express.Router();
const jsonParser = express.json();

//get
contactsRouter.get("/getContact/:id", jsonParser, authMiddleware, getTheContact);
contactsRouter.get("/getContacts", jsonParser, authMiddleware, getAllContacts);

//add new
contactsRouter.post("/addContact", jsonParser, authMiddleware, addNewContact);

//edit
contactsRouter.put("/editContact/:id", jsonParser, authMiddleware, editContact);

//delete
contactsRouter.delete("/deleteContact/:id", authMiddleware, authMiddleware, deleteContact);

export default contactsRouter;