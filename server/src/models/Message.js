import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  senderId      : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId    : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content       : { type: String, required: true, trim: true, },
  date_time     : { type: Date,  default: Date.now },
  read          : { type: Boolean, default: false}
}, { timestamps: true})

// Index for efficient querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1, date_time: -1 })
messageSchema.index({ receiverId: 1, senderId: 1, date_time: -1 })

export default mongoose.model('Message', messageSchema)