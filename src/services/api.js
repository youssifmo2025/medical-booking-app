import { supabase } from '../lib/supabase';

// ── Doctors ──────────────────────────────────────────────────
export const getDoctors = async () => {
  const { data, error } = await supabase.from('doctors').select('*');
  if (error) throw error;
  return { data };
};

export const getDoctorById = async (id) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

// ── Appointments ──────────────────────────────────────────────
export const getAppointments = async () => {
  const { data, error } = await supabase.from('appointments').select('*');
  if (error) throw error;
  return { data };
};

export const getAppointmentById = async (id) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

export const createAppointment = async (payload) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return { data };
};

export const updateAppointment = async (id, payload) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return { data };
};

export const deleteAppointment = async (id) => {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
  return { data: { id } };
};
