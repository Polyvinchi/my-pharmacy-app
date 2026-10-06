'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

// IMPORTANT: Server Actions must NOT throw in production.
// Next.js strips thrown error messages in production builds and the client only
// receives "Minified React error #441". We return { ok, data, error } instead so
// the real reason is always visible in the UI.
type Result<T> = { ok: true; data: T } | { ok: false; error: string }

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) {
    throw new Error('متغير NEXT_PUBLIC_SUPABASE_URL غير موجود في إعدادات Vercel (Environment Variables).')
  }
  if (!key || key === 'dummy_key') {
    throw new Error('متغير SUPABASE_SERVICE_ROLE_KEY غير موجود في إعدادات Vercel. أضفه من Project Settings → Environment Variables ثم اعمل Redeploy.')
  }
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function checkIsSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مصرح - برجاء تسجيل الدخول مرة أخرى')

  const role = user.user_metadata?.role || user.app_metadata?.role
  if (role === 'sub_admin') {
    throw new Error('هذه العملية متاحة للمدير الرئيسي فقط')
  }
  return getAdminClient()
}

function fail(err: unknown): { ok: false; error: string } {
  const message = err instanceof Error ? err.message : String(err)
  console.error('[users/actions]', message)
  return { ok: false, error: message }
}

export type AdminUser = {
  id: string
  email: string | undefined
  role: string
  permissions: string[]
  created_at: string
  last_sign_in_at: string | null
}

export async function getUsers(): Promise<Result<AdminUser[]>> {
  try {
    const admin = await checkIsSuperAdmin()
    const { data, error } = await admin.auth.admin.listUsers()
    if (error) throw new Error(error.message)
    return {
      ok: true,
      data: data.users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.user_metadata?.role || u.app_metadata?.role || 'super_admin',
        permissions: Array.isArray(u.user_metadata?.permissions) ? u.user_metadata.permissions : [],
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      })),
    }
  } catch (err) {
    return fail(err)
  }
}

export async function createUser(email: string, password: string, permissions: string[] = []): Promise<Result<null>> {
  try {
    const admin = await checkIsSuperAdmin()
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'sub_admin', permissions },
      app_metadata: { role: 'sub_admin' },
    })
    if (error) throw new Error(error.message)
    return { ok: true, data: null }
  } catch (err) {
    return fail(err)
  }
}

export async function deleteUser(id: string): Promise<Result<null>> {
  try {
    const admin = await checkIsSuperAdmin()
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) throw new Error(error.message)
    return { ok: true, data: null }
  } catch (err) {
    return fail(err)
  }
}

export async function updateUserPassword(id: string, password: string): Promise<Result<null>> {
  try {
    const admin = await checkIsSuperAdmin()
    const { error } = await admin.auth.admin.updateUserById(id, { password })
    if (error) throw new Error(error.message)
    return { ok: true, data: null }
  } catch (err) {
    return fail(err)
  }
}

export async function updateUserPermissions(id: string, permissions: string[]): Promise<Result<null>> {
  try {
    const admin = await checkIsSuperAdmin()
    const { error } = await admin.auth.admin.updateUserById(id, {
      user_metadata: { role: 'sub_admin', permissions },
    })
    if (error) throw new Error(error.message)
    return { ok: true, data: null }
  } catch (err) {
    return fail(err)
  }
}
