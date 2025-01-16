import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Image Function
export const uploadImagesToCloudinary = async (images) => {
    const imageUrls = [];
  
    try {
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });
        imageUrls.push(result.secure_url); // You might want to return the URL instead of the public_id
      }
  
      return imageUrls; // Return an array of image URLs
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Image upload failed.");
    }
  };
  