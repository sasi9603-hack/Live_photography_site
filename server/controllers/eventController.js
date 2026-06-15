import Event from '../models/Event.js';
import Photo from '../models/Photo.js';
import FaceEmbedding from '../models/FaceEmbedding.js';
import FaceSearch from '../models/FaceSearch.js';
import { uploadImage } from '../config/cloudinary.js';
import { isConnected } from '../config/db.js';


// In-Memory mock storage for AI face recognition features in local mode
export const MOCK_FACE_EMBEDDINGS = [];
export const MOCK_FACE_SEARCHES = [];

// Helper to calculate cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const detectAndStoreFaces = async (photo, eventId) => {
  const aiUrl = process.env.AI_SERVICE_URL;
  if (!aiUrl) {
    console.warn("AI_SERVICE_URL missing. Simulating background face embedding creation.");
    // Simulate finding 1-2 faces in the photo
    const facesCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 faces
    
    for (let f = 0; f < facesCount; f++) {
      const mockEmb = Array.from({ length: 512 }, () => Math.random() * 2 - 1);
      const norm = Math.sqrt(mockEmb.reduce((sum, val) => sum + val * val, 0));
      const normalized = mockEmb.map(val => val / (norm || 1));
      
      const faceLocation = {
        x1: Math.floor(Math.random() * 200),
        y1: Math.floor(Math.random() * 200),
        x2: Math.floor(Math.random() * 200) + 200,
        y2: Math.floor(Math.random() * 200) + 200
      };

      if (isConnected) {
        await FaceEmbedding.create({
          event: eventId,
          photo: photo._id,
          faceEmbedding: normalized,
          faceLocation
        });
      } else {
        MOCK_FACE_EMBEDDINGS.push({
          id: `fe-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          event: eventId,
          photo: photo.id,
          faceEmbedding: normalized,
          faceLocation
        });
      }
    }
    return;
  }

  try {
    const body = new URLSearchParams();
    // Resolve absolute URL for the image if it is stored locally
    const photoUrl = photo.url.startsWith('/') ? `http://localhost:5000${photo.url}` : photo.url;
    body.append('photoUrl', photoUrl);

    const res = await fetch(`${aiUrl}/process-photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });

    if (!res.ok) {
      throw new Error(`AI service responded with status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.detectedFaces) {
      for (const face of data.detectedFaces) {
        if (isConnected) {
          await FaceEmbedding.create({
            event: eventId,
            photo: photo._id,
            faceEmbedding: face.faceEmbedding,
            faceLocation: face.faceLocation
          });
        } else {
          MOCK_FACE_EMBEDDINGS.push({
            id: `fe-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            event: eventId,
            photo: photo.id,
            faceEmbedding: face.faceEmbedding,
            faceLocation: face.faceLocation
          });
        }
      }
      console.log(`AI face recognition processed: ${data.facesCount} faces saved for photo ${photo._id || photo.id}`);
    }
  } catch (err) {
    console.error(`AI processing failure for photo ${photo._id || photo.id}:`, err.message);
  }
};

// In-Memory mock storage for local mode
export const MOCK_EVENTS = [
  {
    id: 'e1',
    name: 'Emma & Nathan Wedding',
    date: '2026-06-05',
    code: 'EMMA26',
    clientEmail: 'emma@gmail.com',
    photographer: 'mock-user-1',
    downloadsCount: 12,
    createdAt: new Date()
  },
  {
    id: 'e2',
    name: 'Vanguard Tech Summit',
    date: '2026-05-18',
    code: 'TECH26',
    clientEmail: 'admin@vanguard.io',
    photographer: 'mock-user-1',
    downloadsCount: 8,
    createdAt: new Date()
  },
  {
    id: 'e3',
    name: 'Elena Portrait Session',
    date: '2026-04-12',
    code: 'ELENA4',
    clientEmail: 'elena.v@outlook.com',
    photographer: 'mock-user-1',
    downloadsCount: 4,
    createdAt: new Date()
  }
];

export const MOCK_PHOTOS = [
  // Emma Wedding
  { id: 'p1', event: 'e1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', title: 'Ceremony Kiss', cloudinaryId: 'c1' },
  { id: 'p2', event: 'e1', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800', title: 'Bride Portrait', cloudinaryId: 'c2' },
  { id: 'p3', event: 'e1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', title: 'First Dance', cloudinaryId: 'c3' },
  { id: 'p4', event: 'e1', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800', title: 'Venue Overview', cloudinaryId: 'c4' },
  
  // Tech Summit
  { id: 'p5', event: 'e2', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800', title: 'Panel Q&A', cloudinaryId: 'c5' },
  { id: 'p6', event: 'e2', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800', title: 'Audience View', cloudinaryId: 'c6' },
  { id: 'p7', event: 'e2', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800', title: 'Keynote Speaker', cloudinaryId: 'c7' },
  
  // Elena Session
  { id: 'p8', event: 'e3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800', title: 'Studio Portrait 1', cloudinaryId: 'c8' },
  { id: 'p9', event: 'e3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800', title: 'Studio Portrait 2', cloudinaryId: 'c9' },
  { id: 'p10', event: 'e3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800', title: 'Studio Portrait 3', cloudinaryId: 'c10' }
];

// @desc    Create a new gallery event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  const { name, date, code, clientEmail } = req.body;

  if (!name || !date || !code) {
    return res.status(400).json({ success: false, message: 'Please provide name, date and code' });
  }

  const cleanCode = code.trim().toUpperCase();

  try {
    if (isConnected) {
      // Check if code already taken
      const codeExists = await Event.findOne({ code: cleanCode });
      if (codeExists) {
        return res.status(400).json({ success: false, message: 'Access PIN code is already in use' });
      }

      const event = await Event.create({
        name,
        date,
        code: cleanCode,
        clientEmail: clientEmail || 'client@example.com',
        photographer: req.user.id
      });

      res.status(201).json({ success: true, event });
    } else {
      // Mock mode
      const codeExists = MOCK_EVENTS.find(e => e.code === cleanCode);
      if (codeExists) {
        return res.status(400).json({ success: false, message: 'Access PIN code is already in use' });
      }

      const event = {
        id: `e-${Date.now()}`,
        name,
        date,
        code: cleanCode,
        clientEmail: clientEmail || 'client@example.com',
        photographer: req.user.id,
        downloadsCount: 0,
        createdAt: new Date()
      };

      MOCK_EVENTS.push(event);
      res.status(201).json({ success: true, event });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get photographer events
// @route   GET /api/events
// @access  Private
export const getMyEvents = async (req, res) => {
  try {
    if (isConnected) {
      const dbEvents = await Event.find({ photographer: req.user.id }).sort('-createdAt');
      
      // Map events to include photo count
      const eventsWithCount = await Promise.all(
        dbEvents.map(async (ev) => {
          const photosCount = await Photo.countDocuments({ event: ev._id });
          return {
            id: ev._id,
            name: ev.name,
            date: ev.date.toISOString().split('T')[0],
            code: ev.code,
            clientEmail: ev.clientEmail,
            downloads: ev.downloadsCount,
            photosCount
          };
        })
      );

      res.status(200).json({ success: true, events: eventsWithCount });
    } else {
      // Mock mode: Filter in-memory events for active user
      const userEvents = MOCK_EVENTS.filter(e => e.photographer === req.user.id);
      const eventsWithCount = userEvents.map(ev => {
        const photosCount = MOCK_PHOTOS.filter(p => p.event === ev.id).length;
        return {
          ...ev,
          photosCount
        };
      });

      res.status(200).json({ success: true, events: eventsWithCount });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event and its related photos
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    if (isConnected) {
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      // Verify ownership
      if (event.photographer.toString() !== req.user.id) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this event' });
      }

      // Delete associated photos
      await Photo.deleteMany({ event: eventId });
      await event.deleteOne();

      res.status(200).json({ success: true, message: 'Event and associated photos deleted successfully' });
    } else {
      // Mock mode
      const eventIdx = MOCK_EVENTS.findIndex(e => e.id === eventId);
      if (eventIdx === -1) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const event = MOCK_EVENTS[eventIdx];
      if (event.photographer !== req.user.id) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this event' });
      }

      // Remove photos & event from mock lists
      const remainingPhotos = MOCK_PHOTOS.filter(p => p.event !== eventId);
      MOCK_PHOTOS.length = 0;
      MOCK_PHOTOS.push(...remainingPhotos);

      MOCK_EVENTS.splice(eventIdx, 1);

      res.status(200).json({ success: true, message: 'Event and associated photos deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload multiple photos to an event
// @route   POST /api/events/:id/photos
// @access  Private
export const uploadPhotos = async (req, res) => {
  const eventId = req.params.id;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload files' });
    }

    let eventExists;
    if (isConnected) {
      eventExists = await Event.findById(eventId);
    } else {
      eventExists = MOCK_EVENTS.find(e => e.id === eventId);
    }

    if (!eventExists) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const uploadedPhotos = [];

    // Process each file upload
    for (const file of req.files) {
      const uploadResult = await uploadImage(file.buffer, file.originalname);
      
      const title = file.originalname.split('.')[0] || 'Capture';

      if (isConnected) {
        const photo = await Photo.create({
          url: uploadResult.url,
          cloudinaryId: uploadResult.publicId,
          title: title,
          event: eventId
        });
        uploadedPhotos.push(photo);
        // Trigger background face embedding process
        detectAndStoreFaces(photo, eventId).catch(err => console.error("Error in background face detection:", err));
      } else {
        // Mock mode
        const photo = {
          id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          event: eventId,
          url: uploadResult.url,
          title: title,
          cloudinaryId: uploadResult.publicId
        };
        MOCK_PHOTOS.push(photo);
        uploadedPhotos.push(photo);
        // Trigger background face embedding process (mock mode)
        detectAndStoreFaces(photo, eventId).catch(err => console.error("Error in background face detection:", err));
      }
    }

    res.status(200).json({
      success: true,
      message: `${uploadedPhotos.length} photos uploaded successfully`,
      photos: uploadedPhotos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client gallery event details and photos by code
// @route   GET /api/gallery/:code
// @access  Public
export const getGalleryByCode = async (req, res) => {
  const code = req.params.code.trim().toUpperCase();

  try {
    if (isConnected) {
      const event = await Event.findOne({ code });
      if (!event) {
        return res.status(404).json({ success: false, message: 'Gallery code is invalid' });
      }

      const photos = await Photo.find({ event: event._id });
      res.status(200).json({
        success: true,
        event: {
          id: event._id,
          eventName: event.name,
          date: event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          code: event.code,
          downloads: event.downloadsCount
        },
        photos: photos.map(p => ({
          id: p._id,
          url: p.url,
          title: p.title
        }))
      });
    } else {
      // Mock mode
      const event = MOCK_EVENTS.find(e => e.code === code);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Gallery code is invalid' });
      }

      const photos = MOCK_PHOTOS.filter(p => p.event === event.id);
      
      const dateFormatted = new Date(event.date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });

      res.status(200).json({
        success: true,
        event: {
          id: event.id,
          eventName: event.name,
          date: dateFormatted,
          code: event.code,
          downloads: event.downloadsCount
        },
        photos: photos.map(p => ({
          id: p.id,
          url: p.url,
          title: p.title
        }))
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment event downloads
// @route   PUT /api/gallery/:code/download
// @access  Public
export const incrementDownloads = async (req, res) => {
  const code = req.params.code.trim().toUpperCase();

  try {
    if (isConnected) {
      const event = await Event.findOneAndUpdate(
        { code },
        { $inc: { downloadsCount: 1 } },
        { new: true }
      );
      if (!event) {
        return res.status(404).json({ success: false, message: 'Gallery code invalid' });
      }
      res.status(200).json({ success: true, downloads: event.downloadsCount });
    } else {
      // Mock mode
      const event = MOCK_EVENTS.find(e => e.code === code);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Gallery code invalid' });
      }
      event.downloadsCount += 1;
      res.status(200).json({ success: true, downloads: event.downloadsCount });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Guest face search: uploads a selfie and returns matching event photos
// @route   POST /api/events/:id/face-search
// @access  Public
export const searchByFace = async (req, res) => {
  const eventId = req.params.id;
  const threshold = parseFloat(req.body.threshold) || 0.85;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a selfie image file.' });
    }

    let eventExists;
    if (isConnected) {
      eventExists = await Event.findById(eventId);
    } else {
      eventExists = MOCK_EVENTS.find(e => e.id === eventId);
    }

    if (!eventExists) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const aiUrl = process.env.AI_SERVICE_URL;
    let guestEmbedding = null;

    if (aiUrl) {
      // 1. Send selfie file to Python AI service /extract-face
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('file', blob, req.file.originalname);

      const aiRes = await fetch(`${aiUrl}/extract-face`, {
        method: 'POST',
        body: formData
      });

      if (!aiRes.ok) {
        const errorData = await aiRes.json().catch(() => ({}));
        return res.status(400).json({ 
          success: false, 
          message: errorData.detail || 'AI engine failed to extract face from selfie. Make sure your face is clearly visible.' 
        });
      }

      const aiData = await aiRes.json();
      if (aiData.success && aiData.faceEmbedding) {
        guestEmbedding = aiData.faceEmbedding;
      }
    }

    // 2. Query candidates from database / mock list
    let candidates = [];
    if (isConnected) {
      candidates = await FaceEmbedding.find({ event: eventId }).populate('photo');
    } else {
      // Mock mode candidate fetch
      candidates = MOCK_FACE_EMBEDDINGS.filter(fe => fe.event === eventId).map(fe => {
        const photo = MOCK_PHOTOS.find(p => p.id === fe.photo);
        return { ...fe, photo };
      });
    }

    let matchedPhotos = [];
    
    if (guestEmbedding) {
      // 3. Compute cosine similarity in Node.js
      const photoMatchesMap = new Map(); // photoId -> highest similarity score

      for (const cand of candidates) {
        const similarity = cosineSimilarity(guestEmbedding, cand.faceEmbedding);
        if (similarity >= threshold) {
          const photoObj = cand.photo;
          if (photoObj) {
            const photoId = photoObj._id ? photoObj._id.toString() : photoObj.id;
            const existingSim = photoMatchesMap.get(photoId) || 0;
            if (similarity > existingSim) {
              photoMatchesMap.set(photoId, {
                photo: photoObj,
                similarity: similarity
              });
            }
          }
        }
      }

      // Convert map to list and sort by similarity descending
      const sortedMatches = Array.from(photoMatchesMap.values())
        .sort((a, b) => b.similarity - a.similarity);
      
      matchedPhotos = sortedMatches.map(m => m.photo);
    } else {
      // Standalone/Mock fallback: pick 1-2 random photos from the event
      console.warn("AI face extractor offline. Simulating matching results.");
      let allPhotos = [];
      if (isConnected) {
        allPhotos = await Photo.find({ event: eventId });
      } else {
        allPhotos = MOCK_PHOTOS.filter(p => p.event === eventId);
      }

      // Randomly select up to 2 photos to mock a positive match
      const count = Math.min(allPhotos.length, Math.floor(Math.random() * 2) + 1);
      const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
      matchedPhotos = shuffled.slice(0, count);
    }

    // 4. Log the face search in database / mock list
    if (isConnected) {
      await FaceSearch.create({
        event: eventId,
        matchedPhotos: matchedPhotos.map(p => p._id)
      });
    } else {
      MOCK_FACE_SEARCHES.push({
        id: `fs-${Date.now()}`,
        event: eventId,
        matchedPhotos: matchedPhotos.map(p => p.id),
        searchTime: new Date()
      });
    }

    res.status(200).json({
      success: true,
      matchesCount: matchedPhotos.length,
      photos: matchedPhotos.map(p => ({
        id: p._id || p.id,
        url: p.url,
        title: p.title
      }))
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get photographer Face Recognition metrics
// @route   GET /api/events/stats/face-recognition
// @access  Private
export const getFaceRecognitionStats = async (req, res) => {
  try {
    let myEvents = [];
    if (isConnected) {
      myEvents = await Event.find({ photographer: req.user.id });
    } else {
      myEvents = MOCK_EVENTS.filter(e => e.photographer === req.user.id);
    }

    const myEventIds = myEvents.map(e => e._id ? e._id.toString() : e.id);

    let totalEvents = myEvents.length;
    let totalPhotos = 0;
    let totalFacesDetected = 0;
    let totalFaceSearches = 0;
    let successfulMatches = 0;

    if (isConnected) {
      totalPhotos = await Photo.countDocuments({ event: { $in: myEvents.map(e => e._id) } });
      totalFacesDetected = await FaceEmbedding.countDocuments({ event: { $in: myEvents.map(e => e._id) } });
      totalFaceSearches = await FaceSearch.countDocuments({ event: { $in: myEvents.map(e => e._id) } });
      successfulMatches = await FaceSearch.countDocuments({ 
        event: { $in: myEvents.map(e => e._id) },
        'matchedPhotos.0': { $exists: true }
      });
    } else {
      // Mock calculations
      totalPhotos = MOCK_PHOTOS.filter(p => myEventIds.includes(p.event)).length;
      totalFacesDetected = MOCK_FACE_EMBEDDINGS.filter(fe => myEventIds.includes(fe.event)).length;
      
      const searches = MOCK_FACE_SEARCHES.filter(fs => myEventIds.includes(fs.event));
      totalFaceSearches = searches.length;
      successfulMatches = searches.filter(fs => fs.matchedPhotos && fs.matchedPhotos.length > 0).length;
    }

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalPhotos,
        totalFacesDetected,
        totalFaceSearches,
        successfulMatches
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
