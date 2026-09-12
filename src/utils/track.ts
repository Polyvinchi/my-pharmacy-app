import { createClient } from '@/utils/supabase/client';

export const trackAction = async (actionType: string) => {
  try {
    const supabase = createClient();
    await supabase.from('action_logs').insert([{ action_type: actionType }]);
  } catch (e) {
    console.error('Failed to track action', e);
  }
};
