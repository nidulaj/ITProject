const { createFinalProduct } = require('../models/finalModel');

const addFinalProduct = async (req, res) => {
  const { pname, batch_no, quantity, expiry_date } = req.body;

  if (!pname || !batch_no || !quantity || !expiry_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newFinalProduct = await createFinalProduct(pname, batch_no, quantity, expiry_date);
    res.status(201).json({ message: 'Final product created successfully', finalProduct: newFinalProduct });
  } catch (error) {
    console.error('Error creating final product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all ingredients 
const { getAllFinalProducts} = require('../models/finalModel');


const getFinalProduct = async (req, res) => {
  try {
    const finalProduct = await getAllFinalProducts();
    res.status(200).json({ finalProduct });
  } catch (error) {
    console.error('Error fetching final product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 

//update
const { updateFinalProduct} = require('../models/finalModel');  // Import updateProduct function

const updateFinalDetails = async (req, res) => {
  const { fproduct_id, pname, batch_no, quantity,expiry_date } = req.body;

  // Validate input data
  if (!fproduct_id || !pname || !batch_no || !quantity || !expiry_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedFinal = await updateFinalProduct( fproduct_id, pname, batch_no, quantity,expiry_date);
    res.status(200).json({ message: 'Final product updated successfully', finalProduct: updatedFinal });
  } catch (error) {
    console.error('Error updating final product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Delete a product from the database
const { deleteFinalProduct } = require('../models/finalModel');  // Import deleteProduct function


const deleteFinalProductDetails = async (req, res) => {
  const { id } = req.params;  // Get the ingredient_id from the URL parameters

  try {
    const deletedFinalProduct = await deleteFinalProduct(id);
    res.status(200).json({ message: 'deleted successfully', finalProduct: deletedFinalProduct });
  } catch (error) {
    console.error('Error deleting :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { addFinalProduct,getFinalProduct ,updateFinalDetails,deleteFinalProductDetails};
