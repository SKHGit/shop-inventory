import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'staff' // 'admin' or 'staff'
  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('user', UserSchema);
export default User;