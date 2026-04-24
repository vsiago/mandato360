"use client"

import React, { useState } from "react"
import { useEditor } from "@/lib/editor-context"
import { cn } from "@/lib/utils"
import { EditorHeader } from "./new/editor-header"
import { SectionNav } from "./new/section-nav"
import { EditorSidebar } from "./new/editor-sidebar"
import { LivePreview } from "./live-preview"
import { normalizeSlug } from "@/lib/tenant-api"
import { FloatingToolbar } from "./floating-toolbar"

export function EditorShell() {
  const {
    data, isDirty, saving, save,
    selectedSection, selectSection, selectElement,
    breakpoint, setBreakpoint
  } = useEditor()

  const tenantSlug = data.slug || normalizeSlug(data.name)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f12]">
      
      {/* Top Header */}
      <EditorHeader 
        device={breakpoint}
        onDeviceChange={setBreakpoint}
        onSave={save}
        isSaving={saving}
        isDirty={isDirty}
        tenantSlug={tenantSlug}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Left Section Navigation */}
        <SectionNav 
          activeSection={selectedSection || "design-system"}
          onSectionChange={(id) => {
            selectSection(id)
            selectElement(null)
          }}
        />

        {/* Live Preview Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#18181b] relative overflow-hidden">
          <div className="flex-1 overflow-hidden relative flex items-start justify-center p-8 lg:p-12">
            
            {/* Device Frame */}
            <div
              className={cn(
                "relative transition-all duration-500 ease-out h-full origin-center",
                breakpoint === "mobile" && "w-[375px] max-w-full",
                breakpoint === "tablet" && "w-[768px] max-w-full",
                breakpoint === "desktop" && "w-full max-w-[1400px]",
              )}
            >
              {/* Browser Chrome for Desktop */}
              {breakpoint === "desktop" && (
                <div className="flex h-10 items-center gap-3 border-b border-white/10 bg-[#1e1e22] px-4 rounded-t-xl">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="flex items-center gap-2 rounded-md bg-[#0f0f12] px-4 py-1.5 border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-white/50 font-mono">agendaonline.com.br/{tenantSlug}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile/Tablet Frame Decoration */}
              {(breakpoint === "mobile" || breakpoint === "tablet") && (
                <div className={cn(
                  "absolute inset-0 border-[8px] border-[#1e1e22] bg-[#0f0f12] shadow-2xl pointer-events-none z-50",
                  breakpoint === "mobile" ? "rounded-[3rem]" : "rounded-[2rem]"
                )}>
                  {breakpoint === "mobile" && <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1e1e22]" />}
                </div>
              )}

              {/* Live rendered content */}
              <div className={cn(
                "relative w-full h-full overflow-hidden bg-white shadow-2xl transition-all duration-500",
                breakpoint === "mobile" && "rounded-[2.5rem] p-2",
                breakpoint === "tablet" && "rounded-[1.5rem] p-2",
                breakpoint === "desktop" && "rounded-b-xl border border-white/10",
              )}>
                <div className="w-full h-full overflow-auto bg-white rounded-[inherit]">
                  <LivePreview />
                </div>
              </div>

              {/* Size info for non-desktop */}
              {breakpoint !== "desktop" && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 whitespace-nowrap">
                  {breakpoint === "mobile" ? "iPhone 14 — 375 × 812" : "iPad Pro — 768 × 1024"}
                </div>
              )}
            </div>

            {/* Device Shadow */}
            <div className={cn(
              "absolute -bottom-10 left-1/2 -z-10 h-20 -translate-x-1/2 rounded-full bg-black/40 blur-3xl",
              breakpoint === "mobile" && "w-64",
              breakpoint === "tablet" && "w-96",
              breakpoint === "desktop" && "w-[80%]"
            )} />
          </div>

          {/* Floating Toolbar (only for Hero) */}
          {selectedSection === 'hero' && <FloatingToolbar />}
        </main>

        {/* Right Sidebar */}
        <EditorSidebar />
      </div>
    </div>
  )
}
