/** URL slug helpers, shared by the admin forms (live preview) and the
 *  server actions (authoritative). The server always re-sanitizes. */

const TRANSLITERATE: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "ae",
  Ö: "oe",
  Ü: "ue",
  ß: "ss",
  ẞ: "ss",
  æ: "ae",
  Æ: "ae",
  ø: "o",
  Ø: "o",
  å: "a",
  Å: "a",
  œ: "oe",
  Œ: "oe",
  ł: "l",
  Ł: "l",
  đ: "d",
  Đ: "d",
  þ: "th",
  Þ: "th",
};

export const SLUG_MAX_LENGTH = 80;

/** Matches a clean slug: lowercase a–z / 0–9 words joined by single dashes. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Converts any text into a safe URL slug.
 *   "Kosgoda Schildkröten & Strand"  → "kosgoda-schildkroeten-and-strand"
 *   "Straße nach Ella"               → "strasse-nach-ella"
 *   "Café Zoë"                       → "cafe-zoe"
 */
export function slugify(input: string): string {
  const slug = input
    .replace(/[äöüÄÖÜßẞæÆøØåÅœŒłŁđĐþÞ]/g, (c) => TRANSLITERATE[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip remaining accents (é → e)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, SLUG_MAX_LENGTH).replace(/-+$/g, "");
}

export function isValidSlug(value: string): boolean {
  return value.length > 0 && value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value);
}
