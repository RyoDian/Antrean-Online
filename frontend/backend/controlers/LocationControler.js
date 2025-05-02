const Location = require('../models/location');
const mongoose = require('mongoose')
  
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


exports.getLocation = async(req , res ) => {
    try {
        const location = await Location.find()
        res.status(200).json({data: location })
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

exports.getLocationById = async(req,res) => {
const id = req.params.id
if(!isValidObjectId){
  return res.status(400).json({message:'id tidak valid'})
}
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.createLocation = async(req,res) =>{
    const {name, kodeLokasi, address} = req.body
    try {
        if(!name || !kodeLokasi || !address ){
            return res.status(400).json({ message:"nama , kodeLokasi , alamat dan admin harus diisi " })
        }

        const existingLocation = await Location.findOne({kodeLokasi});
        if(existingLocation){
            return res.status(400).json({message:" kode sudah ada "})
        }

        const newLocation = new Location({
            name,
            kodeLokasi,
            address
        })

        await newLocation.save()

        res.status(200).json({
            message:"lokasi berhasil di tambahkan",
            location:({
                id : newLocation._id,
                name : newLocation.name,
                kodeLokasi : newLocation.kodeLokasi,
                address : newLocation.address,
                admins : newLocation.admins 
            })
        })
        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateLocation = async (req, res) => {
  const { id } = req.params;

  // Check if the ID format is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const { name, kodeLokasi, address } = req.body;

  try {
    // Check if location exists with the provided ID
    const existingLocation = await Location.findById(id);
    if (!existingLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if kodeLokasi already exists and belongs to a different location
    if (kodeLokasi && kodeLokasi !== existingLocation.kodeLokasi) {
      const duplicateLocation = await Location.findOne({ kodeLokasi });
      if (duplicateLocation) {
        return res.status(400).json({ message: 'Kode Lokasi already exists.' });
      }
    }

    // Proceed with the update if validation checks pass
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      {
        name: name || existingLocation.name,
        kodeLokasi: kodeLokasi || existingLocation.kodeLokasi,
        address: address || existingLocation.address
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Location updated successfully',
      updatedLocation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId) return res.status(400).json({ message: 'Invalid ID format' });
  console.log(id)
  try {
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) return res.status(404).json({ message: 'Location not found' });

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

