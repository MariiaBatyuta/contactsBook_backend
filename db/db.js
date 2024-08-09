import mongoose from "mongoose";

mongoose
    .connect(process.env.DB_URI, { dbName: "Contacts_Book" })
    .then(() => console.log("Database connect successfully."))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })