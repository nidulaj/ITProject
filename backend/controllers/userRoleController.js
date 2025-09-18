const {createRole, getAllRoles} = require("../models/userRoleModel");

const addRole = async (req, res) => {
  const { role_name, description } = req.body;
  console.log(req.body);
  try {
    const newRole = await createRole(role_name, description);
    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error adding role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllUserRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  addRole,
  getAllUserRoles
};