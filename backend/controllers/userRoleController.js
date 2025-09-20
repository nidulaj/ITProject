const {createRole, getAllRoles, deleteRole, getRoleById, updateRole} = require("../models/userRoleModel");

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

const deleteUserRole = async (req, res) => {
  const { roleId } = req.body;
  try {
    const deletedRole = await deleteRole(roleId);
    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(deletedRole);
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserRoleInfoById = async (req, res) => {
  const { roleId } = req.params;
  try {
    const role = await getRoleById(roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { roleId } = req.params;
  const { role_name, description } = req.body;
  try {
    const updatedRole = await updateRole(roleId, role_name, description);
    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    console.log(updatedRole);
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addRole,
  getAllUserRoles,
  deleteUserRole,
  getUserRoleInfoById,
  updateUserRole
};