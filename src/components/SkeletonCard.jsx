const SkeletonCard = () => (
  <div className='bg-card border border-border rounded-2xl overflow-hidden animate-pulse'>
    <div className='h-48 bg-muted' />
    <div className='p-4 flex flex-col gap-3'>
      <div className='flex justify-between gap-2'>
        <div className='h-4 bg-muted rounded w-3/5' />
        <div className='h-4 bg-muted rounded w-1/4' />
      </div>
      <div className='h-3 bg-muted rounded w-2/5' />
      <div className='h-3 bg-muted rounded w-4/5' />
      <div className='h-3 bg-muted rounded w-3/5' />
      <div className='h-8 bg-muted rounded mt-1' />
    </div>
  </div>
);

export default SkeletonCard;
