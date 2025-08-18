const {createCustomer, findUserByEmail, login, updateProfile, deleteProfile, accountStatus} = require("../models/customerAuthModel");

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

        if (!customer.isActive) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error logging in customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserProfile = async (req, res) => {
    const { id, firstName, lastName, phone, address } = req.body;

    try {
        const updatedCustomer = await updateProfile(id, firstName, lastName, phone, address);

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer profile updated successfully", customer: updatedCustomer });
    } catch (error) {
        console.error("Error updating customer profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { registerCustomer, loginCustomer, updateUserProfile };