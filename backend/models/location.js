const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Skema untuk lokasi (kantor cabang Dukcapil)
const LocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  kodeLokasi :{
    type:String ,
    required : true
  },
  address: {
    type: String,
    required: true
  },
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'   
  },],
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
LocationSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Location', LocationSchema);
