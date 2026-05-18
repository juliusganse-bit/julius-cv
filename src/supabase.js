import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xuhjtsqdbdksgubqkzyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aGp0c3FkYmRrc2d1YnFrenlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzIyNDksImV4cCI6MjA5NDYwODI0OX0.uDD00L1OPT6NwjNn0YIMSrWGzZIUK30Q7WLdcT8N2gw'
const printPDF = () => { window.print(); };
export const supabase = createClient(supabaseUrl, supabaseKey)
