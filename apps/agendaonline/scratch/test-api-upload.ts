import fs from "fs";
import path from "path";

async function testApiUpload() {
    const filePath = path.join(__dirname, "..", "public", "logo-studio-jaqueline.png");
    if (!fs.existsSync(filePath)) {
        console.error("Test file not found:", filePath);
        return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("file", blob, "test.png");

    console.log("Sending upload request to /api/upload...");
    try {
        const res = await fetch("http://localhost:3002/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Upload successful!");
            console.log("URL:", data.url);
        } else {
            console.error("Upload failed with status:", res.status);
            console.error("Error data:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testApiUpload().catch(console.error);
