import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide an image url']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Please provide a Cloudinary asset ID']
  },
  title: {
    type: String,
    default: 'Untitiled Capture'
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index event field for fast queries of photos belonging to an event
PhotoSchema.index({ event: 1 });

export default mongoose.model('Photo', PhotoSchema);
