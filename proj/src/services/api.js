import axiosClient from './axiosClient';

// ── Doctors ──────────────────────────────────────────────────
export const getDoctors = async () => {
  const response = await axiosClient.get('/doctors?select=*');
  return { data: response.data };
};

export const getDoctorById = async (id) => {
  const response = await axiosClient.get(`/doctors?id=eq.${id}&select=*`, {
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  });
  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  return { data };
};

// ── Appointments ──────────────────────────────────────────────
export const getAppointments = async () => {
  const response = await axiosClient.get('/appointments?select=*');
  return { data: response.data };
};

export const getAppointmentById = async (id) => {
  const response = await axiosClient.get(`/appointments?id=eq.${id}&select=*`, {
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  });
  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  return { data };
};

export const createAppointment = async (payload) => {
  const response = await axiosClient.post('/appointments', payload, {
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  });
  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  return { data };
};

export const updateAppointment = async (id, payload) => {
  const response = await axiosClient.patch(`/appointments?id=eq.${id}`, payload, {
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  });
  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  return { data };
};

export const deleteAppointment = async (id) => {
  await axiosClient.delete(`/appointments?id=eq.${id}`);
  return { data: { id } };
};
