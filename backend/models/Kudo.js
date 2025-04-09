import mongoose from 'mongoose';

const kudoSchema = new mongoose.Schema({
  sender: { type: String },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: {
    badge: { type: String },
    badgeicon: { type: String },
  },
  reason: { type: String },
  like: [{
    userId: { type: String },
    userName: { type: String }
  },
  ],
  timestamp: { type: Date, default: Date.now },
});

const Kudo = mongoose.model('Kudo', kudoSchema);

export default Kudo;
