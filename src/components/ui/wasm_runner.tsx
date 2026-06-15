import { GlitchSlices, GlitchText } from '#/components/ui/glitch_text.tsx';
import { useWasmEngine } from '#/hooks/use_wasm_engine.ts';

type WasmRunnerProps = {
  gameId: string;
};

export function WasmRunner({ gameId }: WasmRunnerProps) {
  const { bootSequenceText, canvasRef, isBooting, isError, progress } = useWasmEngine(gameId);

  if (isError) {
    return (
      <div className='crt-scanline flex h-full w-full items-center justify-center rounded-xl bg-black max-sm:text-xs md:rounded-[2.5rem]'>
        <GlitchText textClassName='font-label-mono text-primary tracking-widest [text-shadow:0_0_6px_rgba(255,181,158,0.8)]'>
          CRITICAL ERROR: ENGINE BOOT FAILED
        </GlitchText>
      </div>
    );
  }

  return (
    <div className='relative h-full w-full overflow-hidden rounded-xl md:rounded-[2.5rem]'>
      {isBooting && (
        <div className='crt-scanline absolute inset-0 z-50 flex flex-col items-center justify-center bg-background'>
          <div className='absolute top-3 left-3 z-10 h-4 w-4 rounded-tl-lg border-primary border-t-2 border-l-2 opacity-30 md:top-8 md:left-8 md:h-8 md:w-8 md:border-t-4 md:border-l-4'></div>
          <div className='absolute top-3 right-3 z-10 h-4 w-4 rounded-tr-lg border-primary border-t-2 border-r-2 opacity-30 md:top-8 md:right-8 md:h-8 md:w-8 md:border-t-4 md:border-r-4'></div>
          <div className='absolute bottom-3 left-3 z-10 h-4 w-4 rounded-bl-lg border-primary border-b-2 border-l-2 opacity-30 md:bottom-8 md:left-8 md:h-8 md:w-8 md:border-b-4 md:border-l-4'></div>
          <div className='absolute right-3 bottom-3 z-10 h-4 w-4 rounded-br-lg border-primary border-r-2 border-b-2 opacity-30 md:right-8 md:bottom-8 md:h-8 md:w-8 md:border-r-4 md:border-b-4'></div>

          <div className='relative z-20 flex w-72 flex-col items-start md:w-96'>
            <GlitchText
              className='mb-4'
              textClassName='font-label-mono text-primary text-sm md:text-base tracking-widest [text-shadow:0_0_8px_rgba(255,84,76,0.8)]'
            >
              {bootSequenceText}
            </GlitchText>

            <GlitchSlices
              as='div'
              className='w-full [&_.glitch-text-strips]:block [&_.glitch-text-strips]:w-full'
              contentClassName='block w-full'
              stripContentClassName='block w-full'
            >
              <div className='relative h-2 w-full overflow-hidden rounded-full border border-primary/30 bg-surface-variant/50'>
                <div
                  className='h-full bg-primary shadow-[0_0_10px_rgba(255,84,76,1)] transition-all duration-300 ease-out'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </GlitchSlices>

            <div className='mt-2 flex w-full justify-end'>
              <GlitchText textClassName='font-label-mono text-primary text-sm md:text-base tracking-widest [text-shadow:0_0_8px_rgba(255,84,76,0.8)]'>
                {`${progress}%`}
              </GlitchText>
            </div>
          </div>
        </div>
      )}

      <canvas
        tabIndex={0}
        id='redixel-canvas'
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        className={`touch-none! h-full! w-full! cursor-none object-contain transition-opacity duration-1000 focus:outline-none ${
          isBooting ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
