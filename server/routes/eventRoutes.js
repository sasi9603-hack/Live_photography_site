import express from 'express';
import { 
  createEvent, 
  getMyEvents, 
  deleteEvent, 
  uploadPhotos, 
  getGalleryByCode,
  incrementDownloads 
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Protected photographer event management routes
router.route('/')
  .post(protect, createEvent)
  .get(protect, getMyEvents);

router.route('/:id')
  .delete(protect, deleteEvent);

router.route('/:id/photos')
  .post(protect, upload.array('photos', 50), uploadPhotos);

// Public client access routes
router.route('/gallery/:code')
  .get(getGalleryByCode);

router.route('/gallery/:code/download')
  .put(incrementDownloads);

export default router;
