import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['collector', 'artist', 'admin'], default: 'collector' },
  name: String,
  phoneNumber: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  address: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
