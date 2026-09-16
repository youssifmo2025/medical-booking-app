import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import { getAppointments, getDoctors, updateAppointment, deleteAppointment } from '@/services/api';

const AppointmentsPage = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    Boolean(location.state?.bookingSuccess)
  );

  const [editingAppId, setEditingAppId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [savingAppId, setSavingAppId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appRes, docRes] = await Promise.all([getAppointments(), getDoctors()]);

      // Create doc ID -> doc object map
      const docMap = {};
      docRes.data.forEach((d) => {
        docMap[d.id] = d;
      });
      setDoctorsMap(docMap);
      setAppointments(appRes.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await updateAppointment(id, { status: 'cancelled' });
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: 'cancelled' } : app))
      );
    } catch (err) {
      console.error('Failed to cancel appointment', err);
      alert('Could not cancel appointment. Please try again.');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment record?')) return;

    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment', err);
      alert('Could not delete appointment. Please try again.');
    }
  };

  const handleReschedule = async (app) => {
    if (!editDate || !editTime) {
      alert('Please select both a new date and time slot.');
      return;
    }

    const conflict = appointments.find(
      (a) => a.doctorId === app.doctorId && a.id !== app.id && a.date === editDate && a.time === editTime && a.status !== 'cancelled'
    );

    if (conflict) {
      alert('This slot is already booked by another patient. Please choose a different time.');
      return;
    }

    try {
      setSavingAppId(app.id);
      await updateAppointment(app.id, { ...app, date: editDate, time: editTime });
      
      setAppointments((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, date: editDate, time: editTime } : a))
      );
      setEditingAppId(null);
      alert('Appointment rescheduled successfully!');
    } catch (err) {
      console.error('Failed to reschedule appointment', err);
      alert('Could not reschedule appointment. Please try again.');
    } finally {
      setSavingAppId(null);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status?.toLowerCase() === statusFilter;
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'confirmed':
        ariaLabel: 'Confirmed';
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

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-1'>My Appointments</h1>
          <p className='text-muted-foreground text-sm'>
            Manage and track your scheduled medical consultations.
          </p>
        </div>
        <Link
          to='/appointments/new'
          className='inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition shrink-0 shadow-sm'
        >
          <span>+</span> Book New Appointment
        </Link>
      </div>

      {/* Booking Success Banner */}
      {showSuccessBanner && (
        <div className='bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center justify-between text-sm'>
          <div className='flex items-center gap-3'>
            <span className='text-xl'>🎉</span>
            <div>
              <p className='font-semibold'>Appointment booked successfully!</p>
              <p className='text-xs opacity-80'>Your reservation has been saved.</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className='text-xs font-bold underline opacity-80 hover:opacity-100'
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className='flex gap-2 border-b border-border pb-3 overflow-x-auto'>
        {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
              statusFilter === tab
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className='flex flex-col gap-4 animate-pulse'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-card border border-border rounded-2xl p-5 h-36 bg-muted/30' />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className='py-16 flex flex-col items-center justify-center gap-3 text-center'>
          <span className='text-5xl'>⚠️</span>
          <p className='text-lg font-semibold text-foreground'>Failed to load appointments</p>
          <p className='text-sm text-muted-foreground'>Please make sure json-server is running.</p>
          <button
            onClick={fetchData}
            className='bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90'
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className='bg-card border border-border rounded-2xl py-16 px-6 text-center flex flex-col items-center justify-center gap-3'>
          <span className='text-5xl'>📅</span>
          <h2 className='text-lg font-bold text-foreground'>No Appointments Found</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            {statusFilter === 'all'
              ? "You haven't scheduled any appointments yet."
              : `No appointments with status "${statusFilter}".`}
          </p>
          <Link
            to='/appointments/new'
            className='mt-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90'
          >
            Book an Appointment
          </Link>
        </div>
      )}

      {/* Appointments List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className='flex flex-col gap-4'>
          {filteredAppointments.map((app) => {
            const doctor = doctorsMap[app.doctorId];
            const isCancelled = app.status?.toLowerCase() === 'cancelled';

            return (
              <div
                key={app.id}
                className={`bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-5 transition-all w-full ${
                  isCancelled ? 'opacity-70 bg-muted/10' : 'hover:border-primary/30 shadow-xs'
                }`}
              >
                {/* Top section: Left & Right */}
                <div className='flex flex-col sm:flex-row gap-5 items-start justify-between w-full'>
                  {/* Left: Doctor & Appointment Details */}
                  <div className='flex flex-col sm:flex-row gap-4 flex-1'>
                    {/* Doctor Avatar */}
                    {doctor && (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className='w-16 h-16 rounded-xl object-cover border border-border shrink-0 bg-secondary'
                      />
                    )}
  
                    <div className='flex flex-col gap-2'>
                      {/* Header: Doctor Name + Status */}
                      <div className='flex items-center gap-3 flex-wrap'>
                        <h3 className='font-bold text-foreground text-base'>
                          {doctor ? doctor.name : `Doctor ID: ${app.doctorId}`}
                        </h3>
                        {doctor && (
                          <span className='bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-md'>
                            {doctor.specialty}
                          </span>
                        )}
                        {getStatusBadge(app.status)}
                      </div>
  
                      {/* Patient & Reason */}
                      <p className='text-xs text-muted-foreground'>
                        <span className='font-medium text-foreground'>Patient:</span> {app.patientName} ({app.patientPhone})
                      </p>
                      <p className='text-xs text-muted-foreground line-clamp-1'>
                        <span className='font-medium text-foreground'>Reason:</span> {app.reason}
                      </p>
  
                      {/* Date & Time pills */}
                      <div className='flex flex-wrap gap-2 mt-1'>
                        <span className='bg-secondary text-foreground text-xs font-medium px-2.5 py-1 rounded-md border border-border'>
                          📅 {app.date}
                        </span>
                        <span className='bg-primary/5 text-primary font-mono text-xs font-semibold px-2.5 py-1 rounded-md border border-primary/20'>
                          ⏰ {app.time}
                        </span>
                        {doctor && (
                          <span className='bg-secondary text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-md'>
                            📍 {doctor.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
  
                  {/* Right: Actions */}
                  <div className='flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border justify-end'>
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => {
                            setEditingAppId(editingAppId === app.id ? null : app.id);
                            setEditDate(app.date);
                            setEditTime(app.time);
                          }}
                          className='text-xs font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition border border-primary/20'
                        >
                          Edit / Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className='text-xs font-semibold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition border border-destructive/20'
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(app.id)}
                      className='text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition hover:bg-secondary'
                    >
                      Delete Record
                    </button>
                  </div>
                </div>

                {/* Inline Edit Form */}
                {editingAppId === app.id && doctor && (
                  <div className='w-full pt-4 mt-1 border-t border-border flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-sm font-bold text-foreground'>Reschedule Appointment</h4>
                      <button onClick={() => setEditingAppId(null)} className='text-xs text-muted-foreground hover:text-foreground'>
                        Cancel Edit
                      </button>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-foreground'>New Date</label>
                        <input
                          type='date'
                          min={new Date().toISOString().split('T')[0]}
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className='bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none'
                        />
                      </div>

                      <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-foreground'>Available Time Slot</label>
                        <div className='flex flex-wrap gap-2'>
                          {doctor.availableSlots.map((slot) => (
                            <button
                              type='button'
                              key={slot}
                              onClick={() => setEditTime(slot)}
                              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition ${
                                editTime === slot
                                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow'
                                  : 'bg-background hover:bg-secondary text-foreground border-border'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className='flex justify-end mt-2'>
                      <button
                        onClick={() => handleReschedule(app)}
                        disabled={savingAppId === app.id}
                        className='bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2'
                      >
                        {savingAppId === app.id ? (
                          <>
                            <span className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            Saving...
                          </>
                        ) : (
                          'Confirm Reschedule'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

