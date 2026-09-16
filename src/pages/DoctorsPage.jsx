import { useState, useEffect } from 'react';
import useDoctorStore from '@/store/useDoctorStore';
import DoctorCard from '@/components/DoctorCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import useDebounce from '@/hooks/useDebounce';
import useFavoritesStore from '@/store/useFavoritesStore';

// ── Main page ─────────────────────────────────────────────────
const DoctorsPage = () => {
  const { doctors, loading, error, fetchDoctors } = useDoctorStore();

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite } = useFavoritesStore();

  // ── Debounced search — only re-filters 350 ms after user stops typing ──
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ── Derived: unique specialties for <select> ──────────────
  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();

  // ── Derived: filtered list (AND logic) ───────────────────
  const filtered = doctors.filter((d) => {
    const matchesName = d.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? d.specialty === selectedSpecialty : true;
    const matchesFavorites = showFavoritesOnly ? isFavorite(d.id) : true;
    return matchesName && matchesSpecialty && matchesFavorites;
  });

  // ── Render ────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-foreground mb-1'>Find a Doctor</h1>
        <p className='text-muted-foreground'>
          Browse {doctors.length > 0 ? doctors.length : ''} specialists and book an appointment.
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-3 mb-8'>
        <input
          type='text'
          placeholder='Search by name…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
        />
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className='sm:w-52 bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition'
        >
          <option value=''>All Specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
            showFavoritesOnly
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
              : 'bg-card text-muted-foreground border-border hover:bg-secondary'
          }`}
        >
          {showFavoritesOnly ? '❤️ Favorites' : '🤍 Favorites'}
        </button>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <EmptyState
          icon='⚠️'
          title='Failed to load doctors'
          description='Make sure json-server is running on port 3001.'
          action={
            <button
              onClick={fetchDoctors}
              className='bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity'
            >
              Retry
            </button>
          }
        />
      )}

      {/* ── Results ── */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            /* Empty state — only after a successful fetch with zero matches */
            <EmptyState
              icon='🔍'
              title='No doctors match your search'
              description='Try a different name or specialty.'
              action={
                <button
                  onClick={() => { setSearch(''); setSelectedSpecialty(''); }}
                  className='text-sm text-primary underline underline-offset-2 hover:opacity-80 transition-opacity'
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorsPage;
