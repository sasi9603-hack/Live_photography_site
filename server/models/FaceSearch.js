import mongoose from 'mongoose';

const FaceSearchSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  guestId: {
    type: String,
    required: true,
    default: () => 'guest-' + Math.random().toString(36).substr(2, 9)
  },
  matchedPhotos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Photo'
    }
  ],
  searchTime: {
    type: Date,
    default: Date.now
  }
});

FaceSearchSchema.index({ event: 1 });

export default mongoose.model('FaceSearch', FaceSearchSchema);
