export function parseAllowedEmails(raw: string | undefined): string[] {
  return (raw || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined, allowedEmails: string[]): boolean {
  if (!email) return false;
  if (allowedEmails.length === 0) return false;
  return allowedEmails.includes(email.trim().toLowerCase());
}
