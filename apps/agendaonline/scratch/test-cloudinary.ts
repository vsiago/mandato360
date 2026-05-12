import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
    console.log("Config:", {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "MISSING",
    });

    try {
        console.log("Attempting test upload...");
        const result = await cloudinary.uploader.upload("https://github.com/github.png", {
            folder: "test-agenda",
        });
        console.log("Upload successful!");
        console.log("URL:", result.secure_url);
    } catch (error) {
        console.error("Upload failed:");
        console.error(error);
    }
}

testUpload().catch(console.error);
