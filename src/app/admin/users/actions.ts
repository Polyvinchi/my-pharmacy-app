'use server'

import { supabaseAdmin } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

async function checkIsSuperAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'dummy_key') {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. Please add it to your Vercel project settings.");
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const role = user.user_metadata?.role || user.app_metadata?.role;
  if (role === 'sub_admin') {
    throw new Error("Forbidden: Only Super Admin can perform this action");
  }
  return true;
}

export async function getUsers() {
  await checkIsSuperAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  return data.users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.user_metadata?.role || u.app_metadata?.role || 'super_admin',
    permissions: u.user_metadata?.permissions || [],
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at
  }));
}

export async function createUser(email: string, password: string, permissions: string[] = []) {
  await checkIsSuperAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'sub_admin', permissions },
    app_metadata: { role: 'sub_admin' }
  });
  if (error) throw new Error(error.message);
  return data.user;
}

export async function deleteUser(id: string) {
  await checkIsSuperAdmin();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateUserPassword(id: string, password: string) {
  await checkIsSuperAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    password
  });
  if (error) throw new Error(error.message);
  return data.user;
}

export async function updateUserPermissions(id: string, permissions: string[]) {
  await checkIsSuperAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    user_metadata: { role: 'sub_admin', permissions }
  });
  if (error) throw new Error(error.message);
  return data.user;
}
