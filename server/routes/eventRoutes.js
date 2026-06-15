import express from 'express';
import { 
  createEvent, 
  getMyEvents, 
  deleteEvent, 
  uploadPhotos, 
  getGalleryByCode,
  incrementDownloads,
  searchByFace,
  getFaceRecognitionStats
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Face recognition stats (placed before /:id parameter route to avoid conflicts)
router.route('/stats/face-recognition')
  .get(protect, getFaceRecognitionStats);

// Protected photographer event management routes
router.route('/')
  .post(protect, createEvent)
  .get(protect, getMyEvents);

router.route('/:id')
  .delete(protect, deleteEvent);

router.route('/:id/photos')
  .post(protect, upload.array('photos', 50), uploadPhotos);

// Guest face recognition upload and matching
router.route('/:id/face-search')
  .post(upload.single('selfie'), searchByFace);

// Public client access routes
router.route('/gallery/:code')
  .get(getGalleryByCode);

router.route('/gallery/:code/download')
  .put(incrementDownloads);

export default router;

