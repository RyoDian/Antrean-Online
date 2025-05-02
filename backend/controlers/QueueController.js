const Queue = require('../models/queue');
const Location = require('../models/location');
const Service = require('../models/Service');
const { default: mongoose } = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createQueue = async (req, res) => {
  try {
    const { code, queue_date } = req.body;
    const { location_id } = req.params;

    // Validate queue_date input
    if (!queue_date || isNaN(new Date(queue_date))) {
      return res.status(400).json({ message: 'Invalid queue date provided.' });
    }

    // Set current date and adjust hours to start of the day
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(now.getDate() + 2);

    // Convert queue_date to a Date object and set hours
    const bookingDate = new Date(queue_date);
    bookingDate.setHours(0, 0, 0, 0);

    // Ensure queue can only be booked for today or tomorrow
    if (bookingDate < now || bookingDate >= dayAfterTomorrow) {
      return res.status(400).json({ message: 'Queue can only be booked for today or tomorrow.' });
    }

    // Set cutoff time to 4 PM for today's bookings
    const cutoffTime = new Date();
    cutoffTime.setHours(16, 0, 0, 0);

    // If booking is for today and past 4 PM, disallow booking
    if (bookingDate.toDateString() === now.toDateString() && new Date() >= cutoffTime) {
      return res.status(400).json({ message: 'Queue booking for today is closed after 4 PM.' });
    }

    // Retrieve location information
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: 'Invalid location ID.' });
    }

    // Retrieve service information by code
    const service = await Service.findOne({ code });
    if (!service) {
      return res.status(404).json({ message: 'Invalid service code.' });
    }

    // Ensure req.user._id exists
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User ID is required to create a queue.' });
    }

    // // Check if the user already has a queue for the same date, location, and service
    // const existingQueue = await Queue.findOne({
    //   service_id: service._id,
    //   user_id: req.user._id,
    // });

    // if (existingQueue) {
    //   return res.status(400).json({ message: 'User already has a queue for this location and date.' });
    // }

    // Determine the next queue number for this location, service, and date
    const nextQueueNumber = await getNextQueueNumber(location_id, service._id, bookingDate);

    // Create queue code
    const queueCode = `${location.kodeLokasi}-${service.code}-${String(nextQueueNumber).padStart(2, '0')}`;

    // Create a new queue entry
    const newQueue = new Queue({
      location_id,
      service_id: service._id,
      queue_number: nextQueueNumber,
      queue_code: queueCode,
      user_id: req.user._id,
      queue_date: bookingDate,
    });

    await newQueue.save();
    return res.status(201).json({ message: 'Queue created successfully', queue_date, queueCode , status:newQueue.status  });
  } catch (error) {
    console.error("Error in createQueue:", error); // Log error for debugging
    res.status(500).json({ message: 'Internal server error', error: error.message || error });
  }
};

// Function to get the next queue number if no reset is needed
async function getNextQueueNumber(location_id, service_id, bookingDate) {
  const lastQueue = await Queue.find({ location_id, service_id, queue_date: bookingDate })
    .sort({ queue_number: -1 })
    .limit(1);
  return lastQueue.length > 0 ? lastQueue[0].queue_number + 1 : 1;
}


exports.getQueueByID = async (req, res) => {
  const id = req.user._id; // Ambil ID antrean dari URL parameter
  if(!isValidObjectId){
    return res.status(400).json({message:'id tidak valid'})
  }
  try {
    const response = await Queue.find({user_id:id}); // Cari antrean berdasarkan ID
    
    if (!response) {
      return res.status(404).json({ message: 'Antrean tidak ditemukan. Silakan mengambil antrean.' });
    }

    res.json(response); // Kirimkan data antrean sebagai respons JSON
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

