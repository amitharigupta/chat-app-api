import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"]
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  reciever: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true });



export const requestModel = mongoose.model('Request', requestSchema);
