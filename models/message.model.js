import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
  },
  chat: {
    type: mongoose.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  attachments: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true });



export const messageModel = mongoose.model('Message', messageSchema);
