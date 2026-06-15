import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { guardBodyFromWasmStyles } from '#/lib/wasm_styles.ts';

const BOOT_SEQUENCE = [
  { text: 'ALLOCATING VIRTUAL MEMORY...', delay: 0, progress: 0 },
  { text: 'FETCHING WASM MODULES...', delay: 800, progress: 20 },
  { text: 'DECRYPTING ASSETS...', delay: 1000, progress: 45 },
  { text: 'MOUNTING WEBGPU SURFACE...', delay: 800, progress: 65 },
  { text: 'COMPILING SHADERS...', delay: 1000, progress: 85 },
  { text: 'ESTABLISHING ENGINE CONTEXT...', delay: 600, progress: 95 },
  { text: 'SYSTEM READY. INITIATING...', delay: 400, progress: 100 },
];

export function useWasmEngine(gameId: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);
  const abortRef = useRef(false);

  const [isBooting, setIsBooting] = useState(true);
  const [isError, setIsError] = useState(false);

  const [bootStep, setBootStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const initWASM = useCallback(async () => {
    try {
      initialized.current = true;
      const gameFolder = gameId.toLowerCase();
      const cacheBuster = Date.now();

      const basePath = `/static/${gameFolder}/${gameFolder}`;
      const wasmModule = await import(`${basePath}.js?t=${cacheBuster}`);
      await wasmModule.default(`${basePath}_bg.wasm?t=${cacheBuster}`);

      if (!abortRef.current) {
        setIsBooting(false);
        if (canvasRef.current) canvasRef.current.focus();
      }
    } catch (err) {
      console.error(`Failed to initialize WASM module:`, err);
      if (!abortRef.current) setIsError(true);
    }
  }, [gameId]);

  const runBootSequence = useCallback(async () => {
    for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
      if (abortRef.current) return;

      const step = BOOT_SEQUENCE[i];

      if (step.delay > 0) {
        await new Promise((r) => setTimeout(r, step.delay));
      }

      if (abortRef.current) return;

      setBootStep(i);
      setProgress(step.progress);
    }

    await new Promise((r) => setTimeout(r, 400));
    if (abortRef.current) return;

    await initWASM();
  }, [initWASM]);

  useLayoutEffect(() => guardBodyFromWasmStyles(), []);

  useEffect(() => {
    const originalConsoleError = console.error;
    const controller = new AbortController();

    console.error = (...args) => {
      originalConsoleError(...args);

      if (!abortRef.current) {
        setIsError(true);
        setIsBooting(false);
      }
    };

    const handleGlobalCrash = (event: Event) => {
      originalConsoleError('Engine crashed asynchronously:', event);

      if (!abortRef.current) {
        setIsError(true);
        setIsBooting(false);
      }
    };

    window.addEventListener('error', handleGlobalCrash, { signal: controller.signal });
    window.addEventListener('unhandledrejection', handleGlobalCrash, { signal: controller.signal });

    if (!initialized.current) {
      abortRef.current = false;
      runBootSequence();
    }

    return () => {
      abortRef.current = true;
      initialized.current = false;
      console.error = originalConsoleError;
      controller.abort();
    };
  }, [runBootSequence]);

  return {
    canvasRef,
    isBooting,
    isError,
    bootStep,
    progress,
    bootSequenceText: BOOT_SEQUENCE[bootStep].text,
  };
}
