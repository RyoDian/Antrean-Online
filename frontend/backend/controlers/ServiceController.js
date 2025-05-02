const mongoose = require('mongoose');
const Service = require('../models/Service');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


exports.createService = async (req, res) => {
  const { code, name, description } = req.body;

  try {
    if (!code || !name || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if a service with the same code already exists
    const existingCode = await Service.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ message: 'Code already exists.' });
    }

    const newService = new Service({ code, name, description });
    await newService.save();

    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

exports.getService = async(req,res) => {
  try {
    const service = await Service.find();
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ data: service })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.getServiceById = async(req,res) => {
const id = req.params.id
if(!isValidObjectId){
  return res.status(400).json({message:'id tidak valid'})
}
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.updateService = async (req, res) => {
  const { id } = req.params;

  // Cek apakah ID valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid service ID format.' });
  }

  const { code, name, description } = req.body;

  try {
    // Cek apakah service dengan ID tersebut ada
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Cek apakah code sudah ada dan milik service lain
    if (code && code !== existingService.code) {
      const duplicateService = await Service.findOne({ code });
      if (duplicateService) {
        return res.status(400).json({ message: 'Service code already exists.' });
      }
    }

    // Lanjutkan update jika semua validasi lulus
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        code: code || existingService.code,
        name: name || existingService.name,
        description: description || existingService.description,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Service updated successfully',
      updatedService,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid service ID format.' });
  }

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};
