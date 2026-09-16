import { NavLink } from 'react-router';
import useThemeStore from '@/store/useThemeStore';

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary pb-1'
      : 'text-muted-foreground hover:text-foreground transition-colors';

  return (
    <header className='sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border'>
      <nav className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Brand */}
        <NavLink to='/' className='flex items-center gap-2'>
          <span className='text-primary text-xl'>🏥</span>
          <span className='font-bold text-foreground text-lg'>MediBook</span>
        </NavLink>

        <div className='flex items-center gap-6'>
          {/* Links */}
          <ul className='flex items-center gap-6 list-none m-0 p-0'>
            <li>
              <NavLink to='/' end className={linkClass}>
                Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to='/appointments' className={linkClass}>
                Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to='/profile' className={linkClass}>
                Profile
              </NavLink>
            </li>
          </ul>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className='w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-colors'
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
