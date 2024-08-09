import Contact from "../models/contactModel.js";

//get
export const getTheContact = async (req, res, next) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findOne({ _id: id, owner: req.user.id });
        if (!contact) return res.status(404).send({ message: "Contact not found." });

        res.status(200).send(contact);
    } catch (error) {
        next(error);
    }
};

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await Contact.find({ owner: req.user.id });
        if (!users) return res.status(404).send({ message: "Contacts not found." });

        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

//add new
export const addNewContact = async (req, res, next) => {
    const { name, phone } = req.body;

    if (Object.keys(req.body).length === 0) return res.status(401).send({ message: "You must add information in your request." });
    if (!name) return res.status(400).send({ message: "Name is required." });
    if (!phone) return res.status(400).send({ message: "Phone is required." });

    try {
        const newContact = await Contact.create({
            name,
            phone,
            owner: req.user.id,
        });

        res.status(200).send(newContact);
    } catch (error) {
        next(error);
    }
};

//edit
export const editContact = async (req, res, next) => {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    try {
        const updateContact = await Contact.findOneAndUpdate({ _id: id, owner: req.user.id }, { name, phone }, { new: true });
        if (!updateContact) return res.status(404).send({ message: "Contact not found." });

        res.status(200).send(updateContact);
    } catch (error) {
        next(error);
    }
};

//delete
export const deleteContact = async (req, res, next) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findOneAndDelete({ _id: id, owner: req.user.id });
        if (!contact) return res.status(404).send({ message: "Contact not found." });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};