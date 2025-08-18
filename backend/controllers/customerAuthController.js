const {createCustomer, findUserByEmail} = require("../models/customerAuthModel");

const registerCustomer = async (req, res) => {
    const { firstName, lastName, email, phone, username, address, password } = req.body;

    try{
        const existingCustomer = await findUserByEmail(email);

    if (existingCustomer) {
        return res.status(409).json({ message: "User already exists" });
    }

    const customer = await createCustomer(firstName, lastName, email, phone, username, address, password);
    res.status(201).json(customer);
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerCustomer };