/**
 * Phone numbers — one validator, shared by the form and the route.
 *
 * It lives in its own module rather than in `lib/leads.ts` because the capture
 * form is a client component and `lib/leads.ts` reaches for the D1 binding.
 * Importing the validator from there would drag the store into the browser
 * bundle. Nothing in this file touches the runtime, so both sides can hold the
 * same rule — and they have to, or the form accepts a number the API then
 * rejects and the visitor is told "something went wrong" about a field that
 * looked fine.
 *
 * PERMISSIVE, ON PURPOSE. This is now a required field on the one form the
 * whole site exists to fill, so a false rejection is a lost lead. Two shapes
 * are accepted:
 *
 *   - North American, in whatever punctuation people actually type:
 *     `9055550142`, `905-555-0142`, `(905) 555-0142`, `+1 905 555 0142`.
 *   - Anything else, if it is explicitly marked international with a leading
 *     `+`. Brock takes students from outside Canada and some of them hand over
 *     a parent's number; a validator that rejects those is simply wrong.
 *
 * The digit rule below is a real constraint rather than a guess. Under the
 * North American Numbering Plan neither an area code nor an exchange code may
 * begin with 0 or 1, so `[2-9]` in both positions rejects nothing real — and
 * it catches `1234567890` and `0000000000`, which is most of what a bored
 * form-filler types.
 */

/** What the visitor is told, in both places, so the wording cannot drift. */
export const PHONE_ERROR = "That phone number doesn't look right";
export const PHONE_REQUIRED = "We need a phone number to reach you.";

/** E.164 allows 15 digits at most, and no country has fewer than 7 after its code. */
const INTL_MIN = 8;
const INTL_MAX = 15;

/**
 * Returns the number in a single stored shape, or `null` if it is not one.
 *
 * Normalising on the way in rather than on the way out means the admin table,
 * the CSV export and the notification email all read the same, and a number
 * can be dialled straight off the screen. Older rows keep whatever they were
 * stored with — the column is still nullable, because leads captured before
 * this field existed genuinely have no number.
 */
export function normalizePhone(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const digits = value.replace(/\D/g, "");
  const isNorthAmerican = digits.length === 11 && digits.startsWith("1");

  // Marked international, and not a `+1` that belongs to this continent.
  if (value.startsWith("+") && !isNorthAmerican) {
    if (digits.length < INTL_MIN || digits.length > INTL_MAX) return null;
    return `+${digits}`;
  }

  // `1` is the country code, not part of the number.
  const local = isNorthAmerican ? digits.slice(1) : digits;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(local)) return null;

  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/** Cheap enough to run on every keystroke's blur. */
export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}
