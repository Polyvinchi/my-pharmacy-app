const fs = require('fs');
const path = require('path');

const dir = path.join('e:', 'a-a-pharmacy', 'src', 'hooks');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const hook = [
  "'use client';",
  "",
  "import { useEffect, useState } from 'react';",
  "",
  "// Singleton -- never miss the event even if component mounts late",
  "let _prompt: any = null;",
  "const _cbs = new Set<() => void>();",
  "",
  "if (typeof window !== 'undefined') {",
  "  window.addEventListener('beforeinstallprompt', (e: any) => {",
  "    e.preventDefault();",
  "    _prompt = e;",
  "    _cbs.forEach(fn => fn());",
  "  });",
  "}",
  "",
  "export function usePWAInstall() {",
  "  const [ready, setReady] = useState(!!_prompt);",
  "",
  "  useEffect(() => {",
  "    const update = () => setReady(true);",
  "    _cbs.add(update);",
  "    if (_prompt) setReady(true);",
  "    return () => { _cbs.delete(update); };",
  "  }, []);",
  "",
  "  const install = async () => {",
  "    if (!_prompt) return 'unavailable';",
  "    _prompt.prompt();",
  "    const { outcome } = await _prompt.userChoice;",
  "    _prompt = null;",
  "    setReady(false);",
  "    return outcome as 'accepted' | 'dismissed';",
  "  };",
  "",
  "  return { canInstall: ready, install };",
  "}",
].join('\n');

fs.writeFileSync(path.join(dir, 'usePWAInstall.ts'), hook, 'utf8');
console.log('Hook created');
