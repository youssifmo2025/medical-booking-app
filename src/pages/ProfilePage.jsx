import { useState, useEffect } from 'react';
import { getAppointments } from '@/services/api';

const DEFAULT_PROFILE = {
  name: 'Mohamed Ali',
  email: 'm.ali@example.com',
  phone: '+20 111 000 1111',
  dateOfBirth: '1995-06-15',
  bloodType: 'O+',
  insuranceProvider: 'Misr Healthcare',
  insurancePolicyNumber: 'MHC-8849201',
  allergies: 'Penicillin, Dust',
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Fetch stats from appointments
    const fetchStats = async () => {
      try {
        const res = await getAppointments();
        const apps = res.data;
        setStats({
          total: apps.length,
          confirmed: apps.filter((a) => a.status?.toLowerCase() === 'confirmed').length,
          pending: apps.filter((a) => a.status?.toLowerCase() === 'pending').length,
        });
      } catch (err) {
        console.error('Failed to fetch appointment stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    localStorage.setItem('user_profile', JSON.stringify(formData));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-6'>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-1'>My Profile</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your personal information and health preferences.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setFormData(profile);
              setIsEditing(true);
            }}
            className='inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition shrink-0 shadow-sm'
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className='bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-medium'>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Stats Cards Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-card border border-border rounded-2xl p-5 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold'>
            📅
          </div>
          <div>
            <div className='text-2xl font-bold text-foreground'>{stats.total}</div>
            <div className='text-xs text-muted-foreground font-medium'>Total Appointments</div>
          </div>
        </div>

        <div className='bg-card border border-border rounded-2xl p-5 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-bold'>
            ✅
          </div>
          <div>
            <div className='text-2xl font-bold text-foreground'>{stats.confirmed}</div>
            <div className='text-xs text-muted-foreground font-medium'>Confirmed Visits</div>
          </div>
        </div>

        <div className='bg-card border border-border rounded-2xl p-5 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold'>
            ⏳
          </div>
          <div>
            <div className='text-2xl font-bold text-foreground'>{stats.pending}</div>
            <div className='text-xs text-muted-foreground font-medium'>Pending Confirmations</div>
          </div>
        </div>
      </div>

      {/* Profile Form / View */}
      {isEditing ? (
        <form onSubmit={handleSave} className='bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6'>
          <h2 className='text-xl font-bold text-foreground border-b border-border pb-3'>
            Edit Personal Details
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Email Address</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Phone Number</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                required
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Date of Birth</label>
              <input
                type='date'
                name='dateOfBirth'
                value={formData.dateOfBirth}
                onChange={handleChange}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Blood Type</label>
              <select
                name='bloodType'
                value={formData.bloodType}
                onChange={handleChange}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-foreground'>Insurance Provider</label>
              <input
                type='text'
                name='insuranceProvider'
                value={formData.insuranceProvider}
                onChange={handleChange}
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>

            <div className='flex flex-col gap-1.5 sm:col-span-2'>
              <label className='text-sm font-medium text-foreground'>Known Allergies</label>
              <input
                type='text'
                name='allergies'
                value={formData.allergies}
                onChange={handleChange}
                placeholder='e.g. Penicillin, Pollen'
                className='bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 pt-4 border-t border-border'>
            <button
              type='button'
              onClick={() => setIsEditing(false)}
              className='px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition shadow-md'
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className='bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6'>
          {/* User Header */}
          <div className='flex items-center gap-5 border-b border-border pb-6'>
            <div className='w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-3xl flex items-center justify-center border-2 border-primary/20 shrink-0'>
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>{profile.name}</h2>
              <p className='text-sm text-muted-foreground'>{profile.email}</p>
              <span className='inline-block mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20'>
                Verified Patient
              </span>
            </div>
          </div>

          {/* User Details Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                Contact Details
              </h3>
              <div className='flex flex-col gap-2.5 text-sm'>
                <div>
                  <span className='text-muted-foreground text-xs block'>Phone Number</span>
                  <span className='font-medium text-foreground'>{profile.phone}</span>
                </div>
                <div>
                  <span className='text-muted-foreground text-xs block'>Email Address</span>
                  <span className='font-medium text-foreground'>{profile.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                Medical Overview
              </h3>
              <div className='flex flex-col gap-2.5 text-sm'>
                <div>
                  <span className='text-muted-foreground text-xs block'>Blood Type</span>
                  <span className='font-semibold text-primary'>{profile.bloodType}</span>
                </div>
                <div>
                  <span className='text-muted-foreground text-xs block'>Known Allergies</span>
                  <span className='font-medium text-foreground'>{profile.allergies || 'None recorded'}</span>
                </div>
              </div>
            </div>

            <div className='sm:col-span-2 pt-4 border-t border-border'>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                Insurance Coverage
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-secondary/50 p-4 rounded-xl border border-border'>
                <div>
                  <span className='text-muted-foreground text-xs block'>Provider</span>
                  <span className='font-medium text-foreground'>{profile.insuranceProvider}</span>
                </div>
                <div>
                  <span className='text-muted-foreground text-xs block'>Policy Number</span>
                  <span className='font-mono font-medium text-foreground'>{profile.insurancePolicyNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

