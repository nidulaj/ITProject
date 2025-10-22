//  const { createSpecialIngredient } = require('../models/specialModel');

// const addSpecialIngredient = async (req, res) => {
//   const { name, quantity, expiry_date, storage_zone_id } = req.body;

//   if (!name || !quantity || !expiry_date || !storage_zone_id) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     const newSpecialIngredient = await createSpecialIngredient(name, quantity, expiry_date, storage_zone_id);
//     res.status(201).json({ message: 'Ingredient created successfully', specialIngredient: newSpecialIngredient });
//   } catch (error) {
//     console.error('Error creating Ingredient:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
// // Get all ingredients 
// const { getAllSpecialIngredients } = require('../models/specialModel');


// const getSpecialIngredients = async (req, res) => {
//   try {
//     const specialIngredient = await getAllSpecialIngredients();
//     res.status(200).json({ specialIngredient });
//   } catch (error) {
//     console.error('Error fetching ingredients:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
 

// //update
// const { updateSpecialIngredient } = require('../models/specialModel');  // Import updateProduct function

// const updateSpecialIngredientDetails = async (req, res) => {
//   const { special_id, name, quantity, expiry_date, storage_zone_id } = req.body;

//   // Validate input data
//   if (!special_id || !name || !quantity || !expiry_date || !storage_zone_id) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     const updatedSpecialIngredient = await updateSpecialIngredient(special_id, name, quantity, expiry_date, storage_zone_id);
//     res.status(200).json({ message: 'Ingredient updated successfully', specialIngredient: updatedSpecialIngredient });
//   } catch (error) {
//     console.error('Error updating ingredient:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
// // Delete a product from the database
// const { deleteSpecialIngredient } = require('../models/specialModel');  // Import deleteProduct function


// const deleteSpecialIngredientDetails = async (req, res) => {
//   const { id } = req.params;  // Get the ingredient_id from the URL parameters

//   try {
//     const deletedSIngredient = await deleteSpecialIngredient(id);
//     res.status(200).json({ message: 'Ingredient deleted successfully', specialIngredient: deletedSIngredient });
//   } catch (error) {
//     console.error('Error deleting ingredient:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };




// module.exports = { addSpecialIngredient,getSpecialIngredients ,updateSpecialIngredientDetails,deleteSpecialIngredientDetails};



/////////////////////////////////////////////////
const { createSpecialIngredient } = require('../models/specialModel');

const addSpecialIngredient = async (req, res) => {
  const { name, quantity, expiry_date, storage_zone_id } = req.body;

  if (!name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newSpecialIngredient = await createSpecialIngredient(name, quantity, expiry_date, storage_zone_id);
    res.status(201).json({ message: 'Ingredient created successfully', specialIngredient: newSpecialIngredient });
  } catch (error) {
    console.error('Error creating Ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all ingredients 
const { getAllSpecialIngredients } = require('../models/specialModel');


const getSpecialIngredients = async (req, res) => {
  try {
    const specialIngredient = await getAllSpecialIngredients();
    res.status(200).json({ specialIngredient });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 

//update
const { updateSpecialIngredient } = require('../models/specialModel');  // Import updateProduct function

const updateSpecialIngredientDetails = async (req, res) => {
  const { special_id, name, quantity, expiry_date, storage_zone_id } = req.body;

  // Validate input data
  if (!special_id || !name || !quantity || !expiry_date || !storage_zone_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedSpecialIngredient = await updateSpecialIngredient(special_id, name, quantity, expiry_date, storage_zone_id);
    res.status(200).json({ message: 'Ingredient updated successfully', specialIngredient: updatedSpecialIngredient });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Delete a product from the database
const { deleteSpecialIngredient } = require('../models/specialModel');  // Import deleteProduct function


const deleteSpecialIngredientDetails = async (req, res) => {
  const { id } = req.params;  // Get the ingredient_id from the URL parameters

  try {
    const deletedSIngredient = await deleteSpecialIngredient(id);
    res.status(200).json({ message: 'Ingredient deleted successfully', specialIngredient: deletedSIngredient });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { addSpecialIngredient,getSpecialIngredients ,updateSpecialIngredientDetails,deleteSpecialIngredientDetails};
