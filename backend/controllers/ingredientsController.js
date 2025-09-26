


/*
const {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} = require('../models/ingredientModel');

// -------------------- Create --------------------
const addIngredient = async (req, res) => {
  console.log("Received request body:", req.body);
  const { name, quantity, expiry_date, storage_zone_id } = req.body;

  if (!name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newIngredient = await createIngredient(
      name,
      quantity,
      expiry_date,
      storage_zone_id
    );
    console.log("Inserted ingredient:", newIngredient);
    res
      .status(201)
      .json({ message: 'Ingredient created successfully', ingredient: newIngredient });
  } catch (error) {
    console.error('Error creating Ingredient:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// -------------------- Read --------------------
const getIngredients = async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// -------------------- Update --------------------
const updateIngredientDetails = async (req, res) => {
  const { id } = req.params; // ✅ fixed: take id from params
  const { name, quantity, expiry_date, storage_zone_id } = req.body;

  if (!id || !name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedIngredient = await updateIngredient(
      id,
      name,
      quantity,
      expiry_date,
      storage_zone_id
    );
    res.status(200).json({
      message: 'Ingredient updated successfully',
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// -------------------- Delete --------------------
const deleteIngredientDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIngredient = await deleteIngredient(id);
    res.status(200).json({
      message: 'Ingredient deleted successfully',
      ingredient: deletedIngredient,
    });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  addIngredient,
  getIngredients,
  updateIngredientDetails,
  deleteIngredientDetails,
};
*/


///////////////////////////////////////////////////////

//with icode
const {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} = require("../models/ingredientModel");

// -------------------- Create --------------------
const addIngredient = async (req, res) => {
  console.log("Received request body:", req.body);
  const { icode_id, quantity, expiry_date, storage_zone_id } = req.body;

  if (!icode_id || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newIngredient = await createIngredient(
      icode_id,
      quantity,
      expiry_date,
      storage_zone_id
    );
    console.log("Inserted ingredient:", newIngredient);
    res.status(201).json({
      message: "Ingredient created successfully",
      ingredient: newIngredient,
    });
  } catch (error) {
    console.error("Error creating Ingredient:", error);
    res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

// -------------------- Read --------------------
const getIngredients = async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

// -------------------- Update --------------------
const updateIngredientDetails = async (req, res) => {
  const { id } = req.params;
  const { icode_id, quantity, expiry_date, storage_zone_id } = req.body;

  if (!id || !icode_id || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updatedIngredient = await updateIngredient(
      id,
      icode_id,
      quantity,
      expiry_date,
      storage_zone_id
    );
    res.status(200).json({
      message: "Ingredient updated successfully",
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

// -------------------- Delete --------------------
const deleteIngredientDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIngredient = await deleteIngredient(id);
    res.status(200).json({
      message: "Ingredient deleted successfully",
      ingredient: deletedIngredient,
    });
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  addIngredient,
  getIngredients,
  updateIngredientDetails,
  deleteIngredientDetails,
};
