import { Fragment, useState } from 'react';
import VideogameAsset from '#/assets/videogame_asset.svg?react';
import { ExampleOverlay } from '#/components/ui/example_overlay.tsx';
import { GlitchSlices, GlitchText, GlitchTextButton } from '#/components/ui/glitch_text.tsx';
import { WasmRunner } from '#/components/ui/wasm_runner.tsx';
import { type GameManifest, useGamesManifest } from '#/hooks/use_games_manifest.ts';
import { getGameAccent } from '#/lib/game_accent.ts';

export function Showcase() {
  const GAMES = useGamesManifest();

  const [activeGame, setActiveGame] = useState<GameManifest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeGameMeta = GAMES.find((game) => game.id === activeGame?.id);

  const handleSelectGame = (game: GameManifest) => {
    if (activeGame?.id === game.id) return;

    setIsExpanded(false);
    setActiveGame(game);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <main className='relative z-10 min-h-screen bg-surface px-margin py-xl' id='showcase'>
      <div className='mx-auto min-w-0 max-w-7xl'>
        <div className='mb-lg flex flex-col items-start border-surface-variant border-b pb-md'>
          <h2 className='font-display-lg text-[32px] text-on-surface leading-none tracking-tight sm:text-[40px] md:text-[48px]'>
            CART_RIDGE_DRIVE
          </h2>
          <p className='mt-2 font-label-mono text-primary text-sm'>WASM_TARGET_INITIALIZED</p>
          <div className='mt-3 flex items-center gap-2 font-label-mono text-on-surface-variant text-sm'>
            <span
              className={`inline-block h-2 w-2 ${isLoading ? 'animate-pulse bg-primary' : 'bg-primary-container'}`}
            ></span>
            {isLoading ? 'SYSTEM_INITIALIZING...' : 'STATUS: ONLINE'}
          </div>
        </div>

        <div className='flex min-h-0 min-w-0 grow flex-col gap-gutter max-md:gap-12 lg:flex-row'>
          <div className='custom-scrollbar flex h-full max-h-80 w-full min-w-0 flex-col gap-4 overflow-y-auto pr-2 sm:max-h-96 lg:max-h-140 lg:w-1/3'>
            {GAMES.map((game) => {
              const isActive = activeGame?.id === game.id;
              const accent = getGameAccent(game.id);

              return (
                <button
                  type='button'
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  style={{
                    ...accent.cssVars,
                    borderLeftColor: 'var(--game-accent)',
                  }}
                  className={`group showcase-card relative flex w-full shrink-0 cursor-pointer flex-col overflow-hidden border border-surface-variant border-l-4 bg-surface-container-low p-md text-left transition-all duration-300 ${isActive ? '-translate-y-1 bg-surface-container shadow-[0_0_32px_var(--game-shadow)]' : 'hover:-translate-y-1 hover:bg-surface-container hover:shadow-[0_0_32px_var(--game-shadow)]'} ${isActive ? 'border-(--game-accent)' : ''}`}
                >
                  <span
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    style={{ background: accent.glowBackground }}
                    aria-hidden
                  />
                  <span
                    className={`crt-scanline pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${isActive ? 'opacity-20' : 'opacity-0 group-hover:opacity-20'}`}
                    aria-hidden
                  />
                  <h3
                    className={`relative z-20 mb-2 font-bold font-headline-lg text-[24px] uppercase transition-colors duration-300 ${isActive ? 'text-(--game-accent-bright)' : 'text-on-surface group-hover:text-(--game-accent-bright)'}`}
                  >
                    {game.title}
                  </h3>
                  <p
                    className={`relative z-20 mb-4 line-clamp-2 font-body-md text-sm transition-colors duration-300 ${isActive ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}
                  >
                    {game.description}
                  </p>
                  <div className='relative z-20 mt-auto flex flex-wrap gap-2'>
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`border px-2 py-1 font-label-mono text-[10px] uppercase tracking-wider transition-colors duration-300 ${isActive ? 'border-(--game-accent) text-(--game-accent-bright)' : 'border-surface-variant text-on-surface-variant group-hover:border-(--game-accent)/40 group-hover:text-(--game-accent-bright)/80'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className={`absolute -inset-px -z-10 blur-lg transition-opacity duration-300 ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'}`}
                    style={{ background: accent.blurBackground }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          <div className='flex w-full min-w-0 items-center justify-center lg:w-2/3'>
            <CrtMonitor activeGame={activeGame} isLoading={isLoading} onPlay={() => setIsExpanded(true)} />
          </div>
        </div>
      </div>

      <ExampleOverlay
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={activeGameMeta ? `MODULE: ${activeGameMeta.title.toUpperCase()}` : 'MODULE'}
      >
        {isExpanded && activeGame ? (
          <CrtMonitor activeGame={activeGame} isLoading={isLoading} variant='immersive' />
        ) : null}
      </ExampleOverlay>
    </main>
  );
}

type CrtMonitorProps = {
  activeGame: GameManifest | null;
  isLoading: boolean;
  variant?: 'inline' | 'immersive';
  onPlay?: () => void;
};

export function CrtMonitor({ activeGame, isLoading, variant = 'inline', onPlay }: CrtMonitorProps) {
  const isImmersive = variant === 'immersive';
  const canPlay = variant === 'inline' && Boolean(activeGame) && !isLoading && Boolean(onPlay);
  const statusText = isLoading ? 'INITIALIZING...' : activeGame ? 'SYSTEM_READY' : 'SELECT A MODULE';

  const subText = isLoading
    ? 'LOADING MODULE...'
    : activeGame?.title
      ? `TARGET: ${activeGame.title}`
      : 'AWAITING INPUT...';

  return (
    <div
      className={`relative z-10 flex h-full w-full min-w-0 max-w-full flex-col items-center rounded-2xl border-4 border-surface-variant bg-surface-container-highest shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),inset_0_-20px_50px_rgba(0,0,0,0.5),0_25px_50px_-12px_rgba(0,0,0,0.8)] md:rounded-4xl md:border-8 ${isImmersive ? 'h-full max-h-[calc(100dvh-5rem)] max-w-6xl p-3 md:max-h-[calc(100vh-7rem)] md:p-6' : 'p-4 md:p-8'}`}
    >
      <div className='pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.4),transparent_30%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.4),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.4),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.4),transparent_30%)] md:rounded-4xl'></div>

      <div className='relative flex aspect-video h-full w-full min-w-0 items-center justify-center rounded-2xl border-4 border-surface-variant/10 bg-black p-2 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.4)] md:rounded-[3rem] md:border-8 md:p-4'>
        <div className='relative h-full w-full min-w-0 overflow-hidden rounded-xl border border-surface-variant/50 bg-background shadow-[inset_0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,84,76,0.1)] md:rounded-[2.5rem]'>
          <div className='pointer-events-none absolute inset-0 z-40 rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,1)] md:rounded-[2.5rem]'></div>

          <div
            className={`relative flex h-full w-full flex-col items-center justify-center bg-background transition-all duration-500 ease-in-out ${
              isLoading ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
            {...(variant === 'inline' ? { id: 'inline-preview-container' } : {})}
          >
            <div
              className={`pointer-events-none absolute inset-0 transition-all duration-500 ease-in-out ${
                isLoading ? 'blur-[2px]' : 'blur-0'
              }`}
              aria-hidden
            >
              <div className='crt-scanline absolute inset-0 z-20 opacity-40'></div>
              <div className='absolute top-0 right-0 bottom-1/2 left-0 z-30 origin-top scale-105 transform rounded-t-xl bg-linear-to-b from-white/10 to-transparent opacity-30 md:rounded-t-[2.5rem]'></div>
              <div className='absolute inset-0 z-30 rounded-xl shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] md:rounded-[2.5rem]'></div>
              <div className='absolute top-3 left-3 h-4 w-4 rounded-tl-lg border-primary border-t-2 border-l-2 opacity-30 md:top-8 md:left-8 md:h-8 md:w-8 md:border-t-4 md:border-l-4'></div>
              <div className='absolute top-3 right-3 h-4 w-4 rounded-tr-lg border-primary border-t-2 border-r-2 opacity-30 md:top-8 md:right-8 md:h-8 md:w-8 md:border-t-4 md:border-r-4'></div>
              <div className='absolute bottom-3 left-3 h-4 w-4 rounded-bl-lg border-primary border-b-2 border-l-2 opacity-30 md:bottom-8 md:left-8 md:h-8 md:w-8 md:border-b-4 md:border-l-4'></div>
              <div className='absolute right-3 bottom-3 h-4 w-4 rounded-br-lg border-primary border-r-2 border-b-2 opacity-30 md:right-8 md:bottom-8 md:h-8 md:w-8 md:border-r-4 md:border-b-4'></div>
            </div>

            <div className='relative z-50 flex h-full w-full flex-col items-center justify-center'>
              {isImmersive && activeGame ? (
                <WasmRunner gameId={activeGame.id} />
              ) : (
                <Fragment>
                  {!activeGame && !isLoading && (
                    <div className='mb-4 flex h-16 w-16 items-center justify-center'>
                      <GlitchSlices
                        className='h-16 w-16'
                        contentClassName='flex h-16 w-16 items-center justify-center'
                        stripContentClassName='flex h-16 w-16 items-center justify-center'
                      >
                        <VideogameAsset className='h-16 w-16 text-primary' />
                      </GlitchSlices>
                    </div>
                  )}

                  <GlitchText
                    className='text-center'
                    textClassName='font-display-lg text-lg text-primary tracking-widest [text-shadow:0_0_12px_rgba(255,84,76,0.8)] sm:text-2xl'
                  >
                    {statusText}
                  </GlitchText>

                  <GlitchText
                    className='mt-2 text-center'
                    textClassName='font-label-mono text-secondary text-xs [text-shadow:0_0_6px_rgba(255,181,158,0.8)] sm:text-sm'
                  >
                    {subText}
                  </GlitchText>

                  {canPlay && (
                    <GlitchTextButton
                      onClick={onPlay}
                      buttonClassName='group mt-4 cursor-pointer border border-primary bg-transparent px-6 py-2 font-label-mono text-sm tracking-widest shadow-[0_0_10px_rgba(255,180,172,0.3)] transition-all hover:bg-primary hover:shadow-[0_0_20px_rgba(255,181,158,0.6)]'
                      textClassName='font-label-mono text-primary text-sm tracking-widest transition-colors group-hover:text-on-primary'
                    >
                      PLAY MODULE
                    </GlitchTextButton>
                  )}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isImmersive && (
        <Fragment>
          <div className='absolute bottom-3 left-4 flex gap-1.5 opacity-30 md:bottom-6 md:left-12 md:gap-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 w-1.5 rounded-full bg-black shadow-inner md:h-16 md:w-2'></div>
            ))}
          </div>
          <div className='absolute right-4 bottom-3 flex gap-1.5 opacity-30 md:right-12 md:bottom-6 md:gap-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 w-1.5 rounded-full bg-black shadow-inner md:h-16 md:w-2'></div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
}
