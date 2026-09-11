'use client';
import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    __pwaPrompt: any;
    __pwaPromptListeners: Array<(e: any) => void>;
  }
}

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Already fired before we mounted?
    if (window.__pwaPrompt) { setCanInstall(true); return; }
    // Register listener for when it fires later
    if (!window.__pwaPromptListeners) window.__pwaPromptListeners = [];
    const fn = () => setCanInstall(true);
    window.__pwaPromptListeners.push(fn);
    return () => {
      window.__pwaPromptListeners = window.__pwaPromptListeners.filter(f => f !== fn);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const prompt = window.__pwaPrompt;
    if (!prompt) return 'unavailable';
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    window.__pwaPrompt = null;
    setCanInstall(false);
    return outcome;
  }, []);

  return { canInstall, install };
}