import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: false, trim: true},
  mobile:   { type: String, required: false, trim: true},
  username: { type: String, required: true, unique: true, trim: true},
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  profile:  { type: String, trim: true},
}, {  timestamps: true })

export default mongoose.model('User', userSchema)