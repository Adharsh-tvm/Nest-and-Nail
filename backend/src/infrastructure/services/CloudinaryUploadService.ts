import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export class CloudinaryUploadService {
  private static isConfigured = false;

  private static ensureConfigured() {
    if (!this.isConfigured) {
      console.log("🔧 Configuring Cloudinary...");
      
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      
      this.isConfigured = true;
      
      // Verify configuration
      const config = cloudinary.config();
      console.log("✅ Cloudinary configured:");
      console.log("  Cloud Name:", config.cloud_name);
      console.log("  API Key:", config.api_key);
    }
  }

  static async upload(filePath: string, folder: string): Promise<string> {
    this.ensureConfigured(); // <-- Ensure config before upload
    
    try {
      console.log("📤 Uploading to Cloudinary:", filePath);
      console.log("📁 Folder:", folder);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: "auto",
      });

      console.log("✅ Upload successful:", result.secure_url);
      fs.unlinkSync(filePath);
      return result.secure_url;
    } catch (error: any) {
      console.error("❌ Cloudinary upload error:", error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
}