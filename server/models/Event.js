import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  code: {
    type: String,
    required: [true, 'Please add an access code/PIN'],
    unique: true,
    trim: true,
    uppercase: true
  },
  clientEmail: {
    type: String,
    required: [true, 'Please add client email']
  },
  photographer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  downloadsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', EventSchema);

