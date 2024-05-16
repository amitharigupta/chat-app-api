import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  groupChat: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true });



export const chatModel = mongoose.model('Chat', chatSchema);
