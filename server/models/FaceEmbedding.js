import mongoose from 'mongoose';

const FaceEmbeddingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo',
    required: true
  },
  faceEmbedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length === 512;
      },
      message: 'Face embedding must have exactly 512 float values.'
    }
  },
  faceLocation: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for super fast lookup
FaceEmbeddingSchema.index({ event: 1 });
FaceEmbeddingSchema.index({ photo: 1 });

export default mongoose.model('FaceEmbedding', FaceEmbeddingSchema);
