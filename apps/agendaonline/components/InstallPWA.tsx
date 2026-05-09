'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPWA({ slug, iconUrl, primaryColor }: { slug: string, iconUrl: string, primaryColor?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
          // Add a small delay for "Quiet UI" philosophy
          setTimeout(() => setIsVisible(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    // Don't show again in this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!isVisible || sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-sm"
      >
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0 relative">
            <img src={iconUrl} alt="App Icon" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate">
              Instalar App
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              Agende mais rápido com o ícone na tela.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="rounded-lg font-bold text-[10px] uppercase tracking-wider h-8 px-4"
              style={{ backgroundColor: primaryColor || '#000', color: '#fff' }}
            >
              Instalar
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={dismissPrompt}
              className="h-8 w-8 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
