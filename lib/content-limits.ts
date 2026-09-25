// Length limits for what authors type about their manga — shared by the
// create/edit forms (maxLength, the synopsis counter) and the API routes
// that store them, so a pasted wall of text can't become a title shown on
// every card, carousel slide and search result.
export const MAX_MANGA_TITLE_LENGTH = 100;
export const MAX_SYNOPSIS_LENGTH = 2000;
export const MAX_CHAPTER_NAME_LENGTH = 100;
export const MAX_ARC_NAME_LENGTH = 100;

// Server-side check for one required text field: must be a string, not
// blank, and at most `max` characters once trimmed. Returns the trimmed
// value to store, or an error message for a 400 response.
export function checkText(value: unknown, label: string, max: number): { value: string } | { error: string } {
  if (typeof value !== "string" || value.trim() === "") return { error: `${label} is required.` };
  const trimmed = value.trim();
  if (trimmed.length > max) return { error: `${label} must be ${max} characters or fewer.` };
  return { value: trimmed };
}
