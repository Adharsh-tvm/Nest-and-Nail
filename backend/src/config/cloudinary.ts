import { v2 as cloudinary } from "cloudinary";

console.log("🚀 Initializing Cloudinary Config");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT SET");
console.log("API Key:", process.env.CLOUDINARY_API_KEY || "❌ NOT SET");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;