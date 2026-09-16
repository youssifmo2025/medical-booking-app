import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useDoctorStore from '@/store/useDoctorStore';
import useAppointmentStore from '@/store/useAppointmentStore';

// ── Zod Validation Schema ──────────────────────────────────────
const appointmentSchema = z.object({
  doctorId: z.coerce.number().min(1, 'Please select a doctor'),
  patientName: z.string().min(3, 'Full name must be at least 3 characters'),
  patientPhone: z.string().min(8, 'Please enter a valid phone number (min 8 digits)'),
  patientEmail: z.string().email('Please enter a valid email address'),
  date: z.string().min(1, 'Please select an appointment date'),
  time: z.string().min(1, 'Please select a time slot'),
  reason: z.string().min(5, 'Please describe the reason for your visit (min 5 characters)'),
  notes: z.string().optional(),
});

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const doctorIdParam = searchParams.get('doctorId');

  const { doctors, loading: loadingDoctors, fetchDoctors } = useDoctorStore();
  const { createAppointment } = useAppointmentStore();
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: doctorIdParam ? Number(doctorIdParam) : '',
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      reason: '',
      notes: '',
    },
  });

  const selectedDoctorId = watch('doctorId');
  const selectedTimeSlot = watch('time');

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const availableDocs = doctors.filter((d) => d.available);

  // If doctorId searchParam is provided, set it in form once doctors are loaded
  useEffect(() => {
    if (doctorIdParam && availableDocs.length > 0) {
      const matchedDoc = availableDocs.find((d) => d.id === Number(doctorIdParam));
      if (matchedDoc) {
        setValue('doctorId', matchedDoc.id);
      }
    }
  }, [doctorIdParam, availableDocs.length, setValue]); // use length to avoid infinite loops if ref changes

  // Selected doctor object for displaying slots/info
  const selectedDoctor = availableDocs.find((d) => d.id === Number(selectedDoctorId));

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = {
        ...data,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await createAppointment(payload);
      // Navigate to My Appointments list page
      navigate('/appointments', { state: { bookingSuccess: true } });
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to book appointment. Please make sure the backend server is running and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date formatted for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className='max-w-2xl mx-auto flex flex-col gap-6'>
      {/* Header */}
      <div>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-3'
        >
          <span>←</span> Back to Doctors
        </Link>
        <h1 className='text-3xl font-bold text-foreground mb-1'>Book an Appointment</h1>
        <p className='text-muted-foreground text-sm'>
          Fill out the details below to schedule your medical consultation.
        </p>
      </div>

      {submitError && (
        <div className='bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center justify-between'>
          <span>{submitError}</span>
          <button onClick={() => setSubmitError(null)} className='text-xs font-bold underline'>
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        {/* Step 1: Doctor Selection */}
        <div className='bg-card border border-border rounded-2xl p-6 flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
            <span>👨‍⚕️</span> Select Doctor & Clinic
          </h2>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-foreground'>Choose Doctor</label>
            <select
              {...register('doctorId')}
              disabled={loadingDoctors}
              className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition disabled:opacity-50'
            >
              <option value=''>-- Select a Doctor --</option>
              {availableDocs.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty}) — {doc.consultationFee} EGP
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <span className='text-xs text-destructive'>{errors.doctorId.message}</span>
            )}
          </div>

          {/* Selected Doctor Summary Card */}
          {selectedDoctor && (
            <div className='mt-2 bg-secondary/50 border border-border rounded-xl p-4 flex items-center gap-4'>
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className='w-14 h-14 rounded-xl object-cover border border-border shrink-0'
              />
              <div className='flex-1 text-sm'>
                <h3 className='font-semibold text-foreground'>{selectedDoctor.name}</h3>
                <p className='text-muted-foreground text-xs'>{selectedDoctor.specialty} • {selectedDoctor.location}</p>
                <p className='text-primary text-xs font-semibold mt-0.5'>Fee: {selectedDoctor.consultationFee} EGP</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Date & Time Slot */}
        <div className='bg-card border border-border rounded-2xl p-6 flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
            <span>📅</span> Schedule Date & Time
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Date Input */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Preferred Date</label>
              <input
                type='date'
                min={todayStr}
                {...register('date')}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
              />
              {errors.date && (
                <span className='text-xs text-destructive'>{errors.date.message}</span>
              )}
            </div>

            {/* Time Slot Select */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Available Time Slot</label>
              {selectedDoctor ? (
                <div className='flex flex-wrap gap-2'>
                  {selectedDoctor.availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        type='button'
                        key={slot}
                        onClick={() => setValue('time', slot, { shouldValidate: true })}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-bold shadow'
                            : 'bg-background hover:bg-secondary text-foreground border-border'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className='text-xs text-muted-foreground italic py-2'>
                  Please select a doctor to see available time slots.
                </p>
              )}
              {errors.time && (
                <span className='text-xs text-destructive'>{errors.time.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Patient Information */}
        <div className='bg-card border border-border rounded-2xl p-6 flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
            <span>👤</span> Patient Information
          </h2>

          <div className='flex flex-col gap-4'>
            {/* Patient Name */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Full Name</label>
              <input
                type='text'
                placeholder='e.g. Mohamed Ali'
                {...register('patientName')}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
              />
              {errors.patientName && (
                <span className='text-xs text-destructive'>{errors.patientName.message}</span>
              )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Phone */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-foreground'>Phone Number</label>
                <input
                  type='tel'
                  placeholder='+20 100 000 0000'
                  {...register('patientPhone')}
                  className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
                />
                {errors.patientPhone && (
                  <span className='text-xs text-destructive'>{errors.patientPhone.message}</span>
                )}
              </div>

              {/* Email */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-foreground'>Email Address</label>
                <input
                  type='email'
                  placeholder='patient@example.com'
                  {...register('patientEmail')}
                  className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
                />
                {errors.patientEmail && (
                  <span className='text-xs text-destructive'>{errors.patientEmail.message}</span>
                )}
              </div>
            </div>

            {/* Reason for Visit */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Reason for Visit</label>
              <textarea
                rows={3}
                placeholder='Briefly describe your symptoms or reason for appointment...'
                {...register('reason')}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none'
              />
              {errors.reason && (
                <span className='text-xs text-destructive'>{errors.reason.message}</span>
              )}
            </div>

            {/* Additional Notes */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>
                Additional Notes <span className='text-xs text-muted-foreground font-normal'>(Optional)</span>
              </label>
              <input
                type='text'
                placeholder='e.g. Previous medical conditions, allergies, or special requests'
                {...register('notes')}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-end gap-3'>
          <Link
            to='/'
            className='px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={submitting}
            className='bg-primary text-primary-foreground font-semibold px-8 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 shadow-md flex items-center gap-2'
          >
            {submitting ? (
              <>
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;

