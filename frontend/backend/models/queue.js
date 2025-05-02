const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Skema untuk antrean
const QueueSchema = new Schema({
  location_id: {
    type: Schema.Types.ObjectId,
    ref: 'Location',   // Referensi ke lokasi layanan Dukcapil
    required: true
  },
  service_id: {
    type: Schema.Types.ObjectId,
    ref : "Service" ,
    required: true
  },
  queue_number: {
    type: Number,
    required: true
  },
  queue_code:{
    type:String,
    required:true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',       // Referensi ke pengguna yang mendaftar antrean
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'completed', 'canceled'], // Status antrean
    default: 'waiting'
  },
  queue_date: {
    type: Date,       // Tanggal dan waktu antrean
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware untuk memperbarui 'updated_at' setiap kali dokumen di-update
QueueSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Queue', QueueSchema);
