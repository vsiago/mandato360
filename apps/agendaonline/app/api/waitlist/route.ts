import { NextResponse } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { z } from "zod";

const waitlistSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
    niche: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = waitlistSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json(
                { message: "Dados inválidos", errors: validatedData.error.flatten() },
                { status: 400 }
            );
        }

        const { name, whatsapp, niche } = validatedData.data;

        // Insert into database
        await db.insert(waitlist).values({
            name,
            whatsapp,
            niche,
        });

        return NextResponse.json({ success: true, message: "Cadastrado com sucesso na lista de espera!" }, { status: 201 });
    } catch (error) {
        console.error("Waitlist error:", error);
        return NextResponse.json(
            { message: "Ocorreu um erro ao processar seu cadastro." },
            { status: 500 }
        );
    }
}
