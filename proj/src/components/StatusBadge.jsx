const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  switch (s) {
    case 'confirmed':
      return (
        <span className='inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20'>
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
          Confirmed
        </span>
      );
    case 'pending':
      return (
        <span className='inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20'>
          <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
          Pending
        </span>
      );
    case 'cancelled':
      return (
        <span className='inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full border border-destructive/20'>
          <span className='w-1.5 h-1.5 rounded-full bg-destructive' />
          Cancelled
        </span>
      );
    default:
      return (
        <span className='inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full'>
          {status}
        </span>
      );
  }
};

export default StatusBadge;
