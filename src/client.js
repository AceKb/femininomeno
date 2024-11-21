import { createClient } from '@supabase/supabase-js';

const URL = 'https://gbflnlpufxudzpuecybt.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmxubHB1Znh1ZHpwdWVjeWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTU1MTksImV4cCI6MjA0NzczMTUxOX0.q4H6yaqLwqcfefzuZoNSqbNghD_tQhw3Qnbwi0I56g8';

export const supabase = createClient(URL, API_KEY);
