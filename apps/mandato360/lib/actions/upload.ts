"use server"

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Nenhum arquivo enviado" };
    }

    // Converter Buffer para Base64 para o Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const url = await uploadToCloudinary(base64Image, "mandatos");
    
    return { success: true, url };
  } catch (error: any) {
    console.error("Upload Action Error:", error);
    return { success: false, error: error.message || "Erro no upload" };
  }
}
