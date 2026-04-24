"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

/* ─── Image Comparison Slider ─── */

const ImageComparisonSlider = ({ before, after }: { before: string; after: string }) => {
    const [sliderPos, setSliderPos] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)

    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPos(percentage)
    }

    useEffect(() => {
        const handle = handleRef.current
        if (!handle) return

        const onPointerDown = (e: PointerEvent) => {
            e.stopPropagation()
            e.preventDefault()
            isDragging.current = true
            handle.setPointerCapture(e.pointerId)
            updatePosition(e.clientX)
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return
            e.preventDefault()
            updatePosition(e.clientX)
        }

        const onPointerUp = (e: PointerEvent) => {
            isDragging.current = false
            handle.releasePointerCapture(e.pointerId)
        }

        handle.addEventListener('pointerdown', onPointerDown)
        handle.addEventListener('pointermove', onPointerMove)
        handle.addEventListener('pointerup', onPointerUp)
        handle.addEventListener('pointercancel', onPointerUp)

        return () => {
            handle.removeEventListener('pointerdown', onPointerDown)
            handle.removeEventListener('pointermove', onPointerMove)
            handle.removeEventListener('pointerup', onPointerUp)
            handle.removeEventListener('pointercancel', onPointerUp)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 select-none"
        >
            {/* After image (full background) */}
            <img src={after} alt="Depois" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" draggable={false} />

            {/* Before image (clipped) */}
            <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={before} alt="Antes" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} />
            </div>

            {/* Divider + Handle — uses setPointerCapture for reliable tracking */}
            <div
                ref={handleRef}
                className="absolute top-0 bottom-0 z-20 cursor-ew-resize touch-none"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)', width: '44px' }}
            >
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200">
                    <div className="flex items-center gap-0.5">
                        <ChevronLeft className="h-3 w-3 text-slate-500 -mr-1" />
                        <ChevronRight className="h-3 w-3 text-slate-500 -ml-1" />
                    </div>
                </div>
            </div>

            {/* Corner labels */}
            <div className="absolute top-2 left-2 z-10 bg-slate-900/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider pointer-events-none">Antes</div>
            <div className="absolute top-2 right-2 z-10 bg-tenant-primary text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-md pointer-events-none">Depois</div>
        </div>
    )
}

/* ─── Draggable Carousel with infinite auto-scroll ─── */

export function DraggableCarousel({ items }: { items: any[] }) {
    const x = useMotionValue(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [paused, setPaused] = useState(false)
    const lastInteractionTime = useRef(Date.now())
    const [itemWidth, setItemWidth] = useState(0)

    useEffect(() => {
        if (contentRef.current) {
            const totalWidth = contentRef.current.scrollWidth
            setItemWidth(totalWidth / 4)
        }
    }, [items])

    useEffect(() => {
        if (itemWidth) {
            x.set(-itemWidth)
        }
    }, [itemWidth])

    useAnimationFrame((t, delta) => {
        if (!paused && Date.now() - lastInteractionTime.current > 2000) {
            const speed = 0.5
            const moveBy = speed * (delta / 16.66)
            x.set(x.get() - moveBy)
        }
    })

    useEffect(() => {
        return x.on("change", (v) => {
            if (itemWidth <= 0) return
            if (v <= -itemWidth * 2) {
                x.set(v + itemWidth)
            } else if (v >= 0) {
                x.set(v - itemWidth)
            }
        })
    }, [itemWidth])

    const handleInteractionStart = () => {
        setPaused(true)
        lastInteractionTime.current = Date.now()
    }
    const handleInteractionEnd = () => {
        setPaused(false)
        lastInteractionTime.current = Date.now()
    }

    return (
        <div
            className="w-full overflow-hidden flex relative touch-pan-y"
            ref={containerRef}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
        >
            <motion.div
                ref={contentRef}
                className="flex items-center"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -10000, right: 10000 }}
                onDragStart={handleInteractionStart}
                onDragEnd={handleInteractionEnd}
                onDrag={() => {
                    lastInteractionTime.current = Date.now()
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-[88vw] md:w-[45vw] lg:w-[23vw] mx-2 bg-white rounded-xl p-2.5 shadow-lg shadow-slate-200/50 border border-slate-100/80 hover:shadow-2xl hover:border-tenant-primary/30 transition-all duration-300 hover:-translate-y-1 pointer-events-auto select-none">
                        <ImageComparisonSlider before={item.before} after={item.after} />
                        <h4 className="text-center font-bold text-slate-900 text-sm mt-3 pointer-events-none">{item.title}</h4>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
