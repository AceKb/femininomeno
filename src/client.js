import { createClient } from '@supabase/supabase-js';

const URL = 'https://drncwunzgqgyifcmftva.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybmN3dW56Z3FneWlmY21mdHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc2NTQ5NiwiZXhwIjoyMDQ2MzQxNDk2fQ.eEo1itgge6GiGM5odQIChRWEJidKR1XeXJf7xfozqWQ';


export const supabase = createClient(URL, API_KEY);