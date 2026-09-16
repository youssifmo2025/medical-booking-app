import { create } from 'zustand';
import { getDoctors } from '@/services/api';

const useDoctorStore = create((set) => ({
  doctors: [],
  loading: false,
  error: null,

  fetchDoctors: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getDoctors();
      set({ doctors: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch doctors', error);
      set({ error: error.message || 'Failed to fetch doctors', loading: false });
    }
  },
}));

export default useDoctorStore;
