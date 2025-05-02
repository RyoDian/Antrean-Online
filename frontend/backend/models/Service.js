const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  code: {
    type: String,
    required: [true, 'Service code is required'],
    unique: true,  // Kode unik untuk setiap jenis layanan, misalnya "A" untuk Akta Kelahiran, "B" untuk Pembuatan KTP
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Service name is required'], // Nama lengkap layanan, misalnya "Akta Kelahiran"
    trim: true,
  },
  description: {
    type: String,
    default: '', // Deskripsi tambahan mengenai layanan ini
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Menyimpan waktu pembuatan layanan
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
