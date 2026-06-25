/**
 * Shared role helpers used by auth pages, the callback route, guards and nav.
 */

export type AppRole = 'player' | 'organizer' | 'admin';

export const APP_ROLES: AppRole[] = ['player', 'organizer', 'admin'];

export function isAppRole(value: unknown): value is AppRole {
  return value === 'player' || value === 'organizer' || value === 'admin';
}

/** Normalize an unknown role value to a safe AppRole (defaults to player). */
export function toRole(value: unknown): AppRole {
  return isAppRole(value) ? value : 'player';
}

/** Where a user should land after authentication, based on role. */
export function dashboardPathForRole(role: unknown): string {
  switch (toRole(role)) {
    case 'admin':
      return '/dashboard/admin';
    case 'organizer':
      return '/dashboard/organizer';
    default:
      return '/dashboard/player';
  }
}
