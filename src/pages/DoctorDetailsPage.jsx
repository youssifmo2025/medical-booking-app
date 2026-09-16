import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getDoctorById } from '@/services/api';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDoctorById(id);
        setDoctor(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const handleImgError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto flex flex-col gap-6 animate-pulse'>
        <div className='h-6 bg-muted rounded w-32' />
        <div className='bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6'>
          <div className='w-32 h-32 sm:w-40 sm:h-40 bg-muted rounded-xl shrink-0' />
          <div className='flex-1 flex flex-col gap-3'>
            <div className='h-6 bg-muted rounded w-2/3' />
            <div className='h-4 bg-muted rounded w-1/3' />
            <div className='h-4 bg-muted rounded w-1/2' />
            <div className='h-10 bg-muted rounded w-40 mt-2' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className='max-w-lg mx-auto flex flex-col items-center justify-center gap-4 py-20 text-center'>
        <span className='text-6xl'>👨‍⚕️</span>
        <h2 className='text-2xl font-bold text-foreground'>Doctor Not Found</h2>
        <p className='text-sm text-muted-foreground'>
          We couldn't find the doctor details you were looking for.
        </p>
        <Link
          to='/'
          className='bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition'
        >
          Back to Doctors List
        </Link>
      </div>
    );
  }

  const {
    name,
    specialty,
    rating,
    reviewCount,
    experience,
    location,
    phone,
    email,
    bio,
    avatar,
    available,
    consultationFee,
    languages = [],
    availableDays = [],
    availableSlots = [],
  } = doctor;

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-6'>
      {/* Back button */}
      <div>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition'
        >
          <span>←</span> Back to Doctors
        </Link>
      </div>

      {/* Doctor Overview Card */}
      <div className='bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start'>
        {/* Avatar */}
        <div className='relative w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border'>
          <img
            src={avatar}
            alt={name}
            onError={handleImgError}
            className='w-full h-full object-cover'
          />
          <div
            style={{ display: 'none' }}
            className='absolute inset-0 items-center justify-center bg-secondary text-5xl'
          >
            👨‍⚕️
          </div>
        </div>

        {/* Info */}
        <div className='flex-1 flex flex-col gap-3 w-full'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div>
              <div className='flex items-center gap-2 flex-wrap'>
                <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>{name}</h1>
                <span className='bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full'>
                  {specialty}
                </span>
              </div>
              <p className='text-sm text-muted-foreground mt-1'>🎓 {experience} Years of Experience</p>
            </div>
            {/* Availability Badge */}
            <div>
              {available ? (
                <span className='inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                  Available for Booking
                </span>
              ) : (
                <span className='inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1 rounded-full border border-destructive/20'>
                  <span className='w-2 h-2 rounded-full bg-destructive' />
                  Currently Unavailable
                </span>
              )}
            </div>
          </div>

          {/* Rating + Fee */}
          <div className='flex flex-wrap items-center gap-4 text-sm pt-1 border-t border-border'>
            <div className='flex items-center gap-1'>
              <span className='text-yellow-500 text-base'>★</span>
              <span className='font-bold text-foreground'>{rating}</span>
              <span className='text-muted-foreground'>({reviewCount} reviews)</span>
            </div>
            <div className='text-muted-foreground'>•</div>
            <div>
              <span className='text-muted-foreground'>Consultation Fee: </span>
              <span className='font-bold text-primary text-base'>{consultationFee} EGP</span>
            </div>
          </div>

          {/* CTA button */}
          <div className='mt-2'>
            {available ? (
              <button
                onClick={() => navigate(`/appointments/new?doctorId=${doctor.id}`)}
                className='bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md'
              >
                📅 Book Appointment
              </button>
            ) : (
              <button
                disabled
                className='bg-muted text-muted-foreground font-semibold px-6 py-3 rounded-xl cursor-not-allowed opacity-60'
              >
                Not Accepting Appointments
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Main Details (2 cols) */}
        <div className='md:col-span-2 flex flex-col gap-6'>
          {/* About */}
          <div className='bg-card border border-border rounded-2xl p-6'>
            <h2 className='text-lg font-bold text-foreground mb-3'>About {name}</h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>{bio}</p>
          </div>

          {/* Schedule */}
          <div className='bg-card border border-border rounded-2xl p-6 flex flex-col gap-4'>
            <h2 className='text-lg font-bold text-foreground'>Availability Schedule</h2>

            <div>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                Working Days
              </h3>
              <div className='flex flex-wrap gap-2'>
                {availableDays.map((day) => (
                  <span
                    key={day}
                    className='bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-lg border border-border'
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                Available Time Slots
              </h3>
              <div className='flex flex-wrap gap-2'>
                {availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className='bg-primary/5 text-primary text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-primary/20'
                  >
                    ⏰ {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className='flex flex-col gap-6'>
          {/* Contact & Location */}
          <div className='bg-card border border-border rounded-2xl p-6 flex flex-col gap-4'>
            <h2 className='text-lg font-bold text-foreground'>Clinic & Contact</h2>

            <div className='flex flex-col gap-3 text-sm'>
              <div className='flex items-start gap-2.5'>
                <span className='text-base shrink-0'>📍</span>
                <div>
                  <div className='font-medium text-foreground'>Location</div>
                  <div className='text-muted-foreground text-xs'>{location}</div>
                </div>
              </div>

              <div className='flex items-start gap-2.5'>
                <span className='text-base shrink-0'>📞</span>
                <div>
                  <div className='font-medium text-foreground'>Phone</div>
                  <a
                    href={`tel:${phone}`}
                    className='text-primary text-xs hover:underline'
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-2.5'>
                <span className='text-base shrink-0'>✉️</span>
                <div>
                  <div className='font-medium text-foreground'>Email</div>
                  <a
                    href={`mailto:${email}`}
                    className='text-primary text-xs hover:underline'
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Languages Spoken */}
          <div className='bg-card border border-border rounded-2xl p-6'>
            <h2 className='text-lg font-bold text-foreground mb-3'>Languages</h2>
            <div className='flex flex-wrap gap-2'>
              {languages.map((lang) => (
                <span
                  key={lang}
                  className='bg-secondary text-muted-foreground text-xs font-medium px-3 py-1 rounded-full'
                >
                  🌐 {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;

