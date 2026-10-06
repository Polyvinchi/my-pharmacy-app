import { createClient } from '@/utils/supabase/server';

export const ADMIN_PAGES = [
  { path: '/admin', perm: 'settings:view' },
  { path: '/admin/statistics', perm: 'stats:view' },
  { path: '/admin/offers', perm: 'offers:view' },
  { path: '/admin/sections', perm: 'sections:view' },
] as const;

export type Access = {
  userId: string | null;
  isSuper: boolean;
  permissions: string[];
  can: (permission: string) => boolean;
};

/**
 * Reads the CURRENT user's access fresh from Supabase Auth (getUser hits the
 * auth server, so permission changes made by the Super Admin apply immediately).
 * "edit" permission implies "view" for the same area.
 */
export async function getAccess(): Promise<Access> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, isSuper: false, permissions: [], can: () => false };
  }

  const role = user.user_metadata?.role || user.app_metadata?.role;
  const isSuper = role !== 'sub_admin';
  const raw = user.user_metadata?.permissions;
  const permissions: string[] = Array.isArray(raw) ? raw : [];

  const can = (permission: string) => {
    if (isSuper) return true;
    if (permissions.includes(permission)) return true;
    if (permission.endsWith(':view')) {
      return permissions.includes(permission.replace(':view', ':edit'));
    }
    return false;
  };

  return { userId: user.id, isSuper, permissions, can };
}

/** First admin page this user is allowed to open (or null if none). */
export function firstAllowedPage(access: Access): string | null {
  return ADMIN_PAGES.find(p => access.can(p.perm))?.path ?? null;
}

/**
 * Checks if the current user has the specified permission.
 * Throws an error if they don't.
 */
export async function requirePermission(permission: string) {
  const access = await getAccess();
  if (!access.userId) throw new Error("Unauthorized");
  if (!access.can(permission)) {
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
