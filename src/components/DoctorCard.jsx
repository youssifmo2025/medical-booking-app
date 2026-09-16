import { Link } from 'react-router';

const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialty,
    rating,
    reviewCount,
    experience,
    location,
    consultationFee,
    bio,
    avatar,
    available,
  } = doctor;

  // Fallback if avatar URL fails to load
  const handleImgError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <Link
      to={`/doctors/${id}`}
      className='group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300'
    >
      {/* Avatar section */}
      <div className='relative h-48 bg-secondary overflow-hidden'>
        <img
          src={avatar}
          alt={name}
          onError={handleImgError}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
        {/* Fallback div — hidden unless image errors */}
        <div
          style={{ display: 'none' }}
          className='absolute inset-0 items-center justify-center bg-secondary text-4xl'
        >
          👨‍⚕️
        </div>

        {/* Unavailable overlay */}
        {!available && (
          <div className='absolute inset-0 bg-background/60 flex items-end p-3'>
            <span className='bg-destructive text-white text-xs font-semibold px-2 py-1 rounded-full'>
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className='p-4 flex flex-col gap-2'>
        {/* Name + specialty badge */}
        <div className='flex items-start justify-between gap-2'>
          <h3 className='font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors'>
            {name}
          </h3>
          <span className='shrink-0 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full'>
            {specialty}
          </span>
        </div>

        {/* Rating */}
        <div className='flex items-center gap-1 text-sm'>
          <span className='text-yellow-500'>★</span>
          <span className='font-medium text-foreground'>{rating}</span>
          <span className='text-muted-foreground'>({reviewCount} reviews)</span>
        </div>

        {/* Experience + location */}
        <div className='flex flex-col gap-1 text-sm text-muted-foreground'>
          <span>🎓 {experience} years experience</span>
          <span className='truncate'>📍 {location}</span>
        </div>

        {/* Bio — 2-line clamp */}
        <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{bio}</p>

        {/* Fee */}
        <div className='mt-2 pt-2 border-t border-border flex items-center justify-between'>
          <span className='text-sm font-semibold text-primary'>
            {consultationFee} EGP
          </span>
          <span className='text-xs text-muted-foreground'>/ visit</span>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
