import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const options = {
  // db: {
  //   schema: 'public',
  // },
  // auth: {
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: true,
  // },
  global: {
    headers: { 'x-my-custom-header': 'FASTING-APP' },
  },
};

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://bfwtpofxsbiiepavfjcc.supabase.co',
  VITE_SUPABASE_KEY,
  options,
);

export default supabase;
