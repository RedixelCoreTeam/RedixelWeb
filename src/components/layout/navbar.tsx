import { useEffect, useState } from 'react';

export function Navbar() {
  const [activeSection, setActiveSection] = useState<'engine' | 'examples'>('engine');

  useEffect(() => {
    const handleScroll = () => {
      const showcaseEl = document.getElementById('showcase');

      if (showcaseEl) {
        const rect = showcaseEl.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection('examples');
        } else {
          setActiveSection('engine');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShowcase = () => {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinkClass = (active: boolean) =>
    `inline-flex h-6 cursor-pointer items-center border-0 bg-transparent p-0 pb-1 font-label-mono text-sm leading-none transition-all duration-300 ${
      active
        ? 'border-primary border-b-2 text-primary'
        : 'border-transparent border-b-2 text-on-surface-variant hover:text-primary-container'
    }`;

  return (
    <nav className='fixed top-0 z-50 mx-auto flex w-full max-w-full items-center justify-between border-surface-variant border-b bg-background/95 px-margin py-3 shadow-[0_4px_20px_rgba(255,180,172,0.05)] backdrop-blur-md'>
      <button
        type='button'
        onClick={scrollToTop}
        className='cursor-pointer border-0 bg-transparent p-0 font-display-lg text-[32px] tracking-tighter drop-shadow-[0_0_20px_rgba(255,84,76,0.4),0_0_40px_rgba(255,84,76,0.5)]'
      >
        <span className='bg-linear-to-b from-primary-fixed via-primary to-primary-container bg-clip-text text-transparent'>
          REDIXEL
        </span>
      </button>

      <ul className='hidden items-center gap-margin md:flex'>
        <li>
          <button type='button' onClick={scrollToTop} className={navLinkClass(activeSection === 'engine')}>
            ENGINE
          </button>
        </li>

        <li>
          <button
            type='button'
            onClick={scrollToShowcase}
            className={navLinkClass(activeSection === 'examples')}
          >
            EXAMPLES
          </button>
        </li>
      </ul>

      <a
        href='https://github.com/RedixelCoreTeam/Redixel'
        target='_blank'
        rel='noopener noreferrer'
        className='cursor-pointer border border-primary bg-transparent px-6 py-2 font-label-mono text-primary text-sm uppercase tracking-widest shadow-[0_0_10px_rgba(255,180,172,0.3)] transition-all hover:bg-primary hover:text-on-primary hover:shadow-[0_0_20px_rgba(255,181,158,0.6)]'
      >
        SOURCE CODE
      </a>
    </nav>
  );
}
