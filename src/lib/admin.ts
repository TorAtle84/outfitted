// Admin configuration
export const ADMIN_EMAILS = ['flytlink.app@gmail.com']

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
