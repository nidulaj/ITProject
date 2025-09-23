 /*const { createZone } = require('../models/storeModel');

const addZone = async (req, res) => {
  const { zone_name, capacity, used_capacity } = req.body;

  if (!zone_name || !capacity || !used_capacity ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newZone = await createZone(zone_name, capacity, used_capacity);
    res.status(201).json({ message: 'Zone created successfully', zone: newZone });
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all ingredients 
const { getAllZones } = require('../models/storeModel');


const getZone= async (req, res) => {
  try {
    const zone = await getAllZones();
    res.status(200).json({ zone });
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 

//update
const { updateZones } = require('../models/storeModel');  // Import updateProduct function

const updateZoneDetails = async (req, res) => {
  const { storage_zone_id, zone_name, capacity, used_capacity } = req.body;

  // Validate input data
  if (!storage_zone_id || !zone_name || !capacity || !used_capacity ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedZone = await updateZones(storage_zone_id, zone_name, capacity, used_capacity);
    res.status(200).json({ message: 'zone updated successfully', zone: updatedZone });
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Delete a product from the database
const { deleteZone } = require('../models/storeModel');  // Import deleteProduct function


const deleteZoneDetails = async (req, res) => {
  const { id } = req.params;  // Get the ingredient_id from the URL parameters

  try {
    const deletedZone = await deleteZone(id);
    res.status(200).json({ message: 'zone deleted successfully', zone: deletedZone });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { addZone,getZone ,updateZoneDetails,deleteZoneDetails};
*/

const { createZone, getAllZones, updateZones, deleteZone } = require('../models/storeModel');

// Add new zone
const addZone = async (req, res) => {
  let { zone_name, capacity, used_capacity } = req.body;

  // Validate required fields
  if (!zone_name || !capacity) {
    return res.status(400).json({ error: 'Zone name and capacity are required.' });
  }

  // Default used_capacity to 0 if not provided
  if (used_capacity === undefined || used_capacity === null) {
    used_capacity = 0;
  }

  try {
    const newZone = await createZone(zone_name, capacity, used_capacity);
    res.status(201).json({ message: 'Zone created successfully', zone: newZone });
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all zones
const getZone = async (req, res) => {
  try {
    const zone = await getAllZones();
    res.status(200).json({ zone });
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update zone
const updateZoneDetails = async (req, res) => {
  const { storage_zone_id, zone_name, capacity, used_capacity } = req.body;

  if (!storage_zone_id || !zone_name || !capacity || used_capacity === undefined) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedZone = await updateZones(storage_zone_id, zone_name, capacity, used_capacity);
    res.status(200).json({ message: 'Zone updated successfully', zone: updatedZone });
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete zone
const deleteZoneDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedZone = await deleteZone(id);
    res.status(200).json({ message: 'Zone deleted successfully', zone: deletedZone });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addZone, getZone, updateZoneDetails, deleteZoneDetails };
