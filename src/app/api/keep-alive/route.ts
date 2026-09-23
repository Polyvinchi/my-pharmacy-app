import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// This endpoint is called by Vercel Cron to keep the Supabase database awake
export async function GET() {
  try {
    const supabase = await createClient();
    
    // A simple lightweight query to register activity in Supabase
    const { data, error } = await supabase.from('pharmacies').select('id').limit(1);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      status: 'active', 
      message: 'Supabase kept alive successfully',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}