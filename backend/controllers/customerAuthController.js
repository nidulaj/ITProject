const {createCustomer, findUserByEmail, login} = require("../models/customerAuthModel");

const registerCustomer = async (req, res) => {
    const { firstName, lastName, email, phone, address, password } = req.body;

    try{
        const existingCustomer = await findUserByEmail(email);

    if (existingCustomer) {
        return res.status(409).json({ message: "User already exists" });
    }

    const customer = await createCustomer(firstName, lastName, email, phone, address, password);
    res.status(201).json(customer);
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await login(email, password);

        if (!customer) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error logging in customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerCustomer, loginCustomer };