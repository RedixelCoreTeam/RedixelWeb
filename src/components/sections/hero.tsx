import ArrowDownward from '#/assets/arrow_downward.svg?react';
import { GlitchText } from '#/components/ui/glitch_text.tsx';
import { ShaderBackground } from '#/components/ui/shader_background.tsx';

export function Hero() {
  const scrollToShowcase = () => {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className='relative flex min-h-screen items-center overflow-hidden pt-20'>
      <ShaderBackground className='pointer-events-none absolute inset-0 z-0 h-full w-full' />

      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%] bg-linear-to-t from-primary-container/45 via-primary/18 to-transparent'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute bottom-0 left-1/2 z-0 h-56 w-[min(100%,720px)] -translate-x-1/2 translate-y-1/4 rounded-full bg-primary-container/35 blur-[100px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-linear-to-t from-primary-fixed/20 to-transparent'
        aria-hidden
      />

      <div
        className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,transparent_20%,var(--color-background)_88%),radial-gradient(ellipse_120%_40%_at_50%_100%,transparent_30%,rgb(19_19_23/0.6)_100%)]'
        aria-hidden
      />

      <div className='relative z-10 mx-auto mt-[-5vh] flex w-full max-w-7xl px-margin'>
        <div className='flex max-w-2xl flex-col items-start gap-margin text-left'>
          <h1
            className='glitch-text relative mb-4 text-left font-bold font-display-lg text-[64px] text-primary leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(255,84,76,0.6)] md:text-[140px]'
            data-text='REDIXEL'
          >
            <span className='relative inline-block'>
              REDIXEL
              <span className='crt-scanline pointer-events-none absolute inset-0 opacity-50' aria-hidden />
            </span>
          </h1>

          <p className='flex max-w-2xl flex-col gap-0 border-primary border-l-2 pl-4 text-left font-body-lg font-light text-lg text-on-surface leading-tight opacity-90 md:text-[24px]'>
            <span>The 2D Game Engine built in Rust.</span>
            <GlitchText textClassName='font-medium text-primary-container'>
              Safe, Fast, and Pixel-Perfect.
            </GlitchText>
          </p>

          <button
            type='button'
            onClick={scrollToShowcase}
            className='group mt-xl flex cursor-pointer items-center gap-2 border-2 border-primary bg-transparent px-10 py-4 font-label-mono text-lg text-primary uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_30px_rgba(255,84,76,0.8)]'
          >
            PLAY EXAMPLES
            <ArrowDownward className='h-6 w-6 text-primary transition-colors group-hover:text-on-primary' />
          </button>
        </div>
      </div>

      <div className='crt-scanline pointer-events-none absolute inset-0 z-0 opacity-30' />
    </header>
  );
}
