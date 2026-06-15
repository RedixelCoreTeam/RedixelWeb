export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-xl flex w-full flex-col items-center justify-between border-outline-variant border-t bg-surface-container-lowest px-margin py-md md:flex-row'>
      <div className='mb-4 font-label-mono text-on-surface text-sm md:mb-0'>
        © {currentYear} REDIXEL ENGINE. BUILT FOR PRECISION.
      </div>
      <ul className='flex gap-margin'>
        <li>
          <a
            href='https://github.com/RedixelCoreTeam/Redixel'
            target='_blank'
            rel='noopener noreferrer'
            className='cursor-pointer font-label-mono text-on-surface-variant text-sm opacity-80 transition-all hover:text-primary hover:opacity-100'
          >
            GITHUB
          </a>
        </li>
      </ul>
    </footer>
  );
}
