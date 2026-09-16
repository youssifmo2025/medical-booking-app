const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-16 px-6 text-center bg-card border border-border rounded-2xl'>
      <span className='text-5xl'>{icon}</span>
      <h2 className='text-lg font-bold text-foreground'>{title}</h2>
      <p className='text-sm text-muted-foreground max-w-sm'>{description}</p>
      {action && <div className='mt-2'>{action}</div>}
    </div>
  );
};

export default EmptyState;
