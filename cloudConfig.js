const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    // Keep the name of the keys the same
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airbnb_DEV',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

module.exports = {
    cloudinary,
    storage
}