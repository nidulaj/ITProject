 const { createIngredient } = require('../models/ingredientModel');

const addIngredient = async (req, res) => {
  const { name, quantity, expiry_date, storage_zone_id } = req.body;

  if (!name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newIngredient = await createIngredient(name, quantity, expiry_date, storage_zone_id);
    res.status(201).json({ message: 'Ingredient created successfully', ingredient: newIngredient });
  } catch (error) {
    console.error('Error creating Ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all ingredients 
const { getAllIngredients } = require('../models/ingredientModel');


const getIngredients = async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 

//update
const { updateIngredient } = require('../models/ingredientModel');  // Import updateProduct function

const updateIngredientDetails = async (req, res) => {
  const { ingredient_id, name, quantity, expiry_date, storage_zone_id } = req.body;

  // Validate input data
  if (!ingredient_id || !name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedIngredient = await updateIngredient(ingredient_id, name, quantity, expiry_date, storage_zone_id);
    res.status(200).json({ message: 'Ingredient updated successfully', ingredient: updatedIngredient });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Delete a product from the database
const { deleteIngredient } = require('../models/ingredientModel');  // Import deleteProduct function


const deleteIngredientDetails = async (req, res) => {
  const { id } = req.params;  // Get the ingredient_id from the URL parameters

  try {
    const deletedIngredient = await deleteIngredient(id);
    res.status(200).json({ message: 'Ingredient deleted successfully', ingredient: deletedIngredient });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { addIngredient,getIngredients ,updateIngredientDetails,deleteIngredientDetails};


  