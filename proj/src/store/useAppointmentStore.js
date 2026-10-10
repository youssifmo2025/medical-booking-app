import { create } from 'zustand';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '@/services/api';

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAppointments();
      set({ appointments: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      set({ error: error.message || 'Failed to fetch appointments', loading: false });
    }
  },

  createAppointment: async (data) => {
    try {
      const response = await createAppointment(data);
      set((state) => ({ appointments: [...state.appointments, response.data] }));
      return response.data;
    } catch (error) {
      console.error('Failed to create appointment', error);
      throw error;
    }
  },

  updateAppointment: async (id, data) => {
    try {
      const response = await updateAppointment(id, data);
      set((state) => ({
        appointments: state.appointments.map((app) => (app.id === id ? response.data : app)),
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to update appointment', error);
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      await deleteAppointment(id);
      set((state) => ({
        appointments: state.appointments.filter((app) => app.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete appointment', error);
      throw error;
    }
  },
}));

export default useAppointmentStore;
