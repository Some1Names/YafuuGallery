import type { GenreSlug } from "@/lib/genres";

// The site's genres (lib/genres.ts) as MangaDex tag ids, so /search's
// genre filter can be applied to MangaDex results too. Looked up from
// GET https://api.mangadex.org/manga/tag by English name; MangaDex files
// "School Life" and "Supernatural" under themes rather than genres, but
// they filter the same way.
//
// Typed against GenreSlug: adding a genre to the site without a tag here
// fails the typecheck.
export const GENRE_TAG_IDS: Record<GenreSlug, string> = {
  action: "391b0423-d847-456f-aff0-8b0cfc03066b",
  adventure: "87cc87cd-a395-47af-b27a-93258283bbc6",
  comedy: "4d32cc48-9f00-4cca-9b5a-a839f0764984",
  drama: "b9af3a63-f058-46de-a9a0-e0c13906197a",
  fantasy: "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
  historical: "33771934-028e-4cb3-8744-691e866a923e",
  horror: "cdad7e68-1419-41dd-bdce-27753074a640",
  mystery: "ee968100-4191-4968-93d3-f82d72be7e46",
  psychological: "3b60b75c-a2d7-4860-ab56-05f391bb889c",
  romance: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
  "school-life": "caaa44eb-cd40-4177-b930-79d3ef2afe87",
  "sci-fi": "256c8bd9-4904-4360-bf4f-508a76d67183",
  "slice-of-life": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
  sports: "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
  supernatural: "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
  thriller: "07251805-a27e-4d59-b488-f0bfbec15168",
};
