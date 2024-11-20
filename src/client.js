import { createClient } from '@supabase/supabase-js';

const URL = 'https://ooxgcqhbumxsiyhrtrfu.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veGdjcWhidW14c2l5aHJ0cmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzNDMzMTUsImV4cCI6MjA0NTkxOTMxNX0.SYZaVeCUI-nBQI8m_Wy6fIMpGcTIrA6MxvfpZaNE3nQ';

export const supabase = createClient(URL, API_KEY);
