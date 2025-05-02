const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
  location: {
    type: Schema.Types.ObjectId,
    ref:'Location',
    default: null
  },
  bio: { type: String , default: null },
  photo: { type: String , default:"photo"},
  phone: { type: String , required : true },
  createdAt: { type: Date, default: Date.now },
});

// Middleware hashing password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method compare password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
