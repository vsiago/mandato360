import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'Studio Jaque Geovanelle - Brow Lamination & Micropigmentação'
export const size = { width: 600, height: 315 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default async function Image() {
    const logoPath = path.join(process.cwd(), 'public', 'logo-studio-jaqueline.png')
    const logoData = fs.readFileSync(logoPath)
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#140e03',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(253, 224, 71, 0.03) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(253, 224, 71, 0.03) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Layer dourado escuro */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(135deg, rgba(173, 133, 81, 0.6) 0%, rgba(20, 14, 3, 0.9) 100%)',
                    }}
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={logoBase64}
                    alt="Logo"
                    height={180}
                    style={{ objectFit: 'contain' }}
                />

                <div style={{
                    position: 'absolute',
                    bottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                }}>
                    Itaguaí, RJ • Casa Beauty
                </div>
            </div>
        ),
        { ...size }
    )
}
