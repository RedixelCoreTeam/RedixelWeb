import { createFileRoute } from '@tanstack/react-router';
import { Footer } from '#/components/layout/footer.tsx';
import { Navbar } from '#/components/layout/navbar.tsx';
import { Hero } from '#/components/sections/hero.tsx';
import { Showcase } from '#/components/sections/showcase.tsx';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div className='overflow-x-hidden font-body-lg'>
      <Navbar />
      <Hero />
      <Showcase />
      <Footer />
    </div>
  );
}
