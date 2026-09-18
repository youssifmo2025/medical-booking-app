import { Link } from 'react-router';

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4'>
      {/* Logo / App name */}
      <span className='text-6xl mb-4'>🏥</span>
      <h1 className='text-4xl sm:text-5xl font-bold text-foreground mb-3'>
        Medi<span className='text-primary'>Book</span>
      </h1>

      {/* Tagline */}
      <p className='text-muted-foreground text-lg sm:text-xl max-w-md mb-8'>
        Find and book appointments with trusted doctors — fast, simple, and free.
      </p>

      {/* CTA */}
      <Link
        to='/doctors'
        className='bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl text-base hover:opacity-90 active:scale-[0.98] transition shadow-md'
      >
        Browse Doctors →
      </Link>
    </div>
  );
};

export default HomePage;
