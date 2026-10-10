import { storage } from '../lib/storage';
import dbData from '../../db.json';

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeData = () => {
  const doctors = storage.getItem('doctors');
  if (!doctors) {
    storage.setItem('doctors', dbData.doctors || []);
  }

  const appointments = storage.getItem('appointments');
  if (!appointments) {
    storage.setItem('appointments', dbData.appointments || []);
  }
};

initializeData();

// ── Doctors ──────────────────────────────────────────────────
export const getDoctors = async () => {
  await delay();
  return { data: storage.getItem('doctors', []) };
};

export const getDoctorById = async (id) => {
  await delay();
  const doctors = storage.getItem('doctors', []);
  const doctor = doctors.find((d) => String(d.id) === String(id));
  return { data: doctor };
};

// ── Appointments ──────────────────────────────────────────────
export const getAppointments = async () => {
  await delay();
  return { data: storage.getItem('appointments', []) };
};

export const getAppointmentById = async (id) => {
  await delay();
  const appointments = storage.getItem('appointments', []);
  const appointment = appointments.find((a) => String(a.id) === String(id));
  return { data: appointment };
};

export const createAppointment = async (payload) => {
  await delay();
  const newAppointment = { ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() };
  let updatedAppointments = [];
  storage.updateItem('appointments', (appointments) => {
    updatedAppointments = [...(appointments || []), newAppointment];
    return updatedAppointments;
  });
  return { data: newAppointment };
};

export const updateAppointment = async (id, payload) => {
  await delay();
  let updatedAppointment = null;
  storage.updateItem('appointments', (appointments) => {
    const list = appointments || [];
    return list.map((app) => {
      if (String(app.id) === String(id)) {
        updatedAppointment = { ...app, ...payload };
        return updatedAppointment;
      }
      return app;
    });
  });
  return { data: updatedAppointment };
};

export const deleteAppointment = async (id) => {
  await delay();
  storage.updateItem('appointments', (appointments) => {
    const list = appointments || [];
    return list.filter((app) => String(app.id) !== String(id));
  });
  return { data: { id } };
};
