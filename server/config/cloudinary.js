import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup Cloudinary config if credentials exist
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.log('--- WARNING: Cloudinary credentials missing. Using local mock file storage instead. ---');
}

// Multer Config (Memory Storage so we can choose to upload to Cloudinary or write locally)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'), false);
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Function to upload photo (Hybrid Cloudinary / Local Disk fallback)
export const uploadImage = async (fileBuffer, originalName) => {
  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'aura_galleries', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  } else {
    // Local fallback: write file to server's static uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName) || '.jpg';
    const filename = `photo-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save buffer to disk
    await fs.promises.writeFile(filePath, fileBuffer);

    // Return relative URL and dummy public ID
    return {
      url: `/uploads/${filename}`,
      publicId: `local-${uniqueSuffix}`
    };
  }
};
