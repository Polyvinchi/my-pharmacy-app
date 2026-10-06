import { createClient } from '@/utils/supabase/server';

/**
 * Checks if the current user has the specified permission.
 * Throws an error if they don't.
 */
export async function requirePermission(permission: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");
  
  const role = user.user_metadata?.role || user.app_metadata?.role;
  // Super Admin bypasses all checks
  if (role === 'super_admin' || (!role && user.email === 'admin@pharmacy.com')) {
    return true;
  }
  
  const permissions: string[] = user.user_metadata?.permissions || [];
  
  if (!permissions.includes(permission)) {
    throw new Error(`Forbidden: You don't have the '${permission}' permission.`);
  }
  
  return true;
}

export async function hasPermission(permission: string) {
  try {
    await requirePermission(permission);
    return true;
  } catch {
    return false;
  }
}
