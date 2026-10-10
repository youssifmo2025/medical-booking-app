import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.trim().replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY.trim();

const axiosClient = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
});

// Normalize Axios errors to match existing error expectations
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.response = error.response;
    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
