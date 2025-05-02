// controllers/AdminQueueController.js
const Queue = require('../models/queue');
const Location = require('../models/location');
const Service = require('../models/Service');

// Fungsi untuk memanggil antrean berikutnya
exports.callNextQueue = async (req, res) => {
  try {
    const { location_id, service_id } = req.params;

    // Validasi lokasi dan layanan
    const location = await Location.findById(location_id);
    const service = await Service.findById(service_id);

    if (!location || !service) {
      return res.status(404).json({ message: 'Invalid location or service.' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Midnight of today
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // End of today

    const today ={ $gte: startOfToday, $lte: endOfToday }

    const todayQueue = await Queue.findOne({ location_id, service_id, status: 'waiting' , queue_date:today})
    if(!todayQueue){
      return res.status(400).json({message:'Sudah tidak ada antrian untuk hari ini '})
    }

    // Cari antrean terdepan yang statusnya "waiting" di lokasi dan layanan yang dipilih
    const nextQueue = await Queue.findOneAndUpdate(
      { location_id, service_id, status: 'waiting' },
      { status: 'called' },
      { new: true }
    ).sort({ queue_number: 1 }); // Urutkan berdasarkan nomor antrean terkecil

    if (!nextQueue) {
      return res.status(404).json({ message: 'No waiting queue found.' });
    }

    res.status(200).json({
      message: 'Next queue called successfully',
      date:nextQueue.queue_date, kode:nextQueue.queue_code , status:nextQueue.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Fungsi untuk mendapatkan antrean terakhir yang dipanggil
exports.getLastCalledQueue = async (req, res) => {
  try {
    const { location_id, service_id } = req.params;

    // Validate location and service
    const location = await Location.findById(location_id);
    const service = await Service.findById(service_id);

    if (!location || !service) {
      return res.status(404).json({ message: 'Invalid location or service.' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Midnight of today
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // End of today

    // Find the last called queue for the specified location, service, and today's date
    const lastCalledQueue = await Queue.findOne({
      location_id,
      service_id,
      status: 'called',
      queue_date: { $gte: startOfToday, $lte: endOfToday }
    }).sort({ queue_number: -1 }); // Sort by queue number in descending order

    if (!lastCalledQueue) {
      return res.status(404).json({ message: 'No called queue found for today.' });
    }

    res.status(200).json({
      message: 'Last called queue fetched successfully',
      queue: {
        date: lastCalledQueue.queue_date,
        code: lastCalledQueue.queue_code,
        status: lastCalledQueue.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fungsi untuk menyelesaikan antrean saat ini
exports.completeQueue = async (req, res) => {
  try {
    const { queue_id } = req.params;

    // Ubah status antrean menjadi "completed"
    const queue = await Queue.findByIdAndUpdate(
      queue_id,
      { status: 'completed' },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found.' });
    }

    res.status(200).json({
      message: 'Queue marked as completed',
      queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
  
// Fungsi untuk membatalkan antrean saat ini
exports.cancelQueue = async (req, res) => {
  try {
    const { queue_id } = req.params;

    // Ubah status antrean menjadi "canceled"
    const queue = await Queue.findByIdAndUpdate(
      queue_id,
      { status: 'canceled' },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found.' });
    }

    res.status(200).json({
      message: 'Queue canceled successfully',
      queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Fungsi untuk mendapatkan antrean saat ini di lokasi tertentu
exports.getCurrentQueue = async (req, res) => {
  try {
    const { location_id, service_id } = req.params;

    // Ambil antrean yang sudah dipanggil hari ini, urutkan descending
    const calledQueues = await Queue.find({
      location_id,
      service_id,
      status: 'called'
    }).sort({ queue_number: -1 }); // Urutkan dari terbesar ke terkecil

    if (!calledQueues || calledQueues.length < 2) {
      return res.status(404).json({ message: 'No previous called queue available.' });
    }

    // Ambil antrean sebelumnya (urutan kedua)
    const previousQueue = calledQueues[1];

    res.status(200).json({
      message: 'Previous called queue fetched successfully',
      queue_date: previousQueue.queue_date,
      queueCode: previousQueue.queue_code,
      status: previousQueue.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

