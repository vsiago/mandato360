import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOptionalSubscription } from "@/lib/subscription-guard";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        // Validate Premium status
        const sub = await getOptionalSubscription();
        const isPremium = sub && ["active", "trialing"].includes(sub.status) && sub.plan === "premium";

        if (!isPremium) {
            return NextResponse.json({ error: "Recurso disponível apenas para usuários Premium" }, { status: 403 });
        }

        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "URL da imagem é obrigatória" }, { status: 400 });
        }

        if (!process.env.API_KEY_REMOVE_BG) {
            console.error("API_KEY_REMOVE_BG is missing");
            return NextResponse.json({ error: "Serviço de remoção de fundo não configurado corretamente" }, { status: 500 });
        }

        // Call Remove.bg API
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": process.env.API_KEY_REMOVE_BG,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: imageUrl,
                size: "auto",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Remove.bg error:", errorData);
            return NextResponse.json({ error: "Falha ao remover o fundo da imagem" }, { status: response.status });
        }

        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder: "agenda-online/removals",
                    format: "png", // Ensure transparency
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({ url: (result as any).secure_url });
    } catch (error) {
        console.error("Remove-bg internal error:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
