import { useSearchParams } from 'react-router';

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');

  return (
    <div>
      <h1 className='text-3xl font-bold text-foreground mb-2'>Book an Appointment</h1>
      <p className='text-muted-foreground'>
        {doctorId
          ? `Booking for doctor ID: ${doctorId}`
          : 'Complete the form below to book your appointment.'}
      </p>
      {/* TODO: React Hook Form booking form with Zod validation */}
    </div>
  );
};

export default BookAppointmentPage;
