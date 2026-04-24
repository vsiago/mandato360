import { ImageResponse } from "next/og"

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = "nodejs"

export default async function Image() {
    const logoPath = join(process.cwd(), 'public', 'logo-agenda-online.svg')
    const logoBuffer = await readFile(logoPath)
    const logoBase64 = logoBuffer.toString('base64')

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'radial-gradient(circle at center, #26190a 0%, #0a0602 100%)',
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={`data:image/svg+xml;base64,${logoBase64}`}
                    style={{
                        width: "550px",
                    }}
                    alt="Agenda Online Logo"
                />
            </div>
        ),
        {
            width: 800,
            height: 420,
        }
    )
}
