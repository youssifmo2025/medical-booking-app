import { useParams } from 'react-router';

const DoctorDetailsPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className='text-3xl font-bold text-foreground mb-2'>Doctor Details</h1>
      <p className='text-muted-foreground'>
        Viewing doctor ID: <span className='text-primary font-mono'>{id}</span>
      </p>
      {/* TODO: doctor profile card, available slots, Book Now button */}
    </div>
  );
};

export default DoctorDetailsPage;
