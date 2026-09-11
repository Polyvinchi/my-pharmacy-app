const fs = require('fs');

// -- ActionGrid: replace manual deferredPrompt with hook --
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Add import
grid = grid.replace(
  "import { useState, useRef, useEffect } from 'react';",
  "import { useState, useRef, useEffect } from 'react';\nimport { usePWAInstall } from '@/hooks/usePWAInstall';"
);

// Remove manual state + useEffect for deferredPrompt
grid = grid.replace(
  "  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);\n  const timerRef = useRef<NodeJS.Timeout | null>(null);\n  const longPressFired = useRef<boolean>(false);\n\n  useEffect(() => {\n    window.addEventListener('beforeinstallprompt', (e: any) => { e.preventDefault(); setDeferredPrompt(e); });\n  }, []);",
  "  const { canInstall, install } = usePWAInstall();\n  const timerRef = useRef<NodeJS.Timeout | null>(null);\n  const longPressFired = useRef<boolean>(false);"
);

// Update handleInstallClick
grid = grid.replace(
    const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setToast('\u0644\u062a\u062b\u0628\u064a\u062a \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0639\u0644\u0649 \u0627\u0644\u0622\u064a\u0641\u0648\u0646\u060c \u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u062b\u0645 Add to Home Screen');
      setTimeout(() => setToast(null), 4000); return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };,
    const handleInstallClick = async () => {
    if (!canInstall) {
      setToast('\u0644\u062a\u062b\u0628\u064a\u062a \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0639\u0644\u0649 \u0627\u0644\u0622\u064a\u0641\u0648\u0646\u060c \u0627\u0636\u063a\u0637 Share \u062b\u0645 Add to Home Screen');
      setTimeout(() => setToast(null), 4000); return;
    }
    await install();
  };
);

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('ActionGrid wired to hook');

// -- ShareModal: replace manual deferredPrompt with hook --
let share = fs.readFileSync('src/components/ShareModal.tsx', 'utf8');

// Add import
share = share.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { usePWAInstall } from '@/hooks/usePWAInstall';"
);

// Remove manual deferredPrompt state + listener
share = share.replace(
  "  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);\n  const [msg, setMsg] = useState<string | null>(null);\n  const [url, setUrl] = useState('');\n\n  useEffect(() => {\n    setUrl(window.location.href);\n    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };\n    window.addEventListener('beforeinstallprompt', handler);\n    return () => window.removeEventListener('beforeinstallprompt', handler);\n  }, []);",
  "  const { canInstall, install } = usePWAInstall();\n  const [msg, setMsg] = useState<string | null>(null);\n  const [url, setUrl] = useState('');\n\n  useEffect(() => {\n    setUrl(window.location.href);\n  }, []);"
);

// Update handleInstall
share = share.replace(
    const handleInstall = async () => {
    if (!deferredPrompt) {
      setMsg('\u0644\u062a\u062b\u0628\u064a\u062a \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0639\u0644\u0649 \u0627\u0644\u0622\u064a\u0641\u0648\u0646\u060c \u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \\u0632\u0631 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u062b\u0645 Add to Home Screen');
      setTimeout(() => setMsg(null), 5000); return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };,
    const handleInstall = async () => {
    if (!canInstall) {
      setMsg('\u0644\u062a\u062b\u0628\u064a\u062a \u0639\u0644\u0649 \u0627\u0644\u0622\u064a\u0641\u0648\u0646: \u0627\u0636\u063a\u0637 Share \u062b\u0645 Add to Home Screen');
      setTimeout(() => setMsg(null), 5000); return;
    }
    await install();
  };
);

fs.writeFileSync('src/components/ShareModal.tsx', share, 'utf8');
console.log('ShareModal wired to hook');
