import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4'>
      <span className='text-8xl'>🏥</span>
      <h1 className='text-6xl font-bold text-primary'>404</h1>
      <h2 className='text-2xl font-semibold text-foreground'>Page Not Found</h2>
      <p className='text-muted-foreground max-w-sm'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to='/'
        className='mt-2 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity'
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
