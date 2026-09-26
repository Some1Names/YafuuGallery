import { useTranslations } from "next-intl";
// Says why a create form's submit button is still disabled — visibly,
// since the old hover tooltip never showed on phones/touch screens.
// Pass the labels of the required fields that aren't filled in yet
// (falsy entries are skipped); renders nothing once they all are.
export default function MissingFieldsHint({ missing }: { missing: (string | false)[] }) {
  const t = useTranslations("Admin");
  const items = missing.filter((m): m is string => Boolean(m));
  if (items.length === 0) return null;
  return (
    <p className="self-end text-right text-xs text-fg-muted">
      {t.rich("stillNeeded", {
        items: items.join(", "),
        b: (chunks) => <span className="text-fg-secondary">{chunks}</span>,
      })}
    </p>
  );
}
