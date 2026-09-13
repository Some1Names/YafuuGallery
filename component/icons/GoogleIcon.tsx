// Google's official multi-color "G" logo, per their brand guidelines for
// sign-in buttons — not a lucide-react icon since lucide only covers
// generic UI icons, not brand marks.
export default function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.766 12.2764c0-.9175-.0824-1.7999-.2353-2.6474H12.24v5.0068h6.4813c-.2802 1.5006-1.1305 2.7726-2.4082 3.6249v3.0106h3.8996c2.2814-2.1004 3.5943-5.1926 3.5943-8.9949z"
      />
      <path
        fill="#34A853"
        d="M12.24 24c3.2472 0 5.9683-1.0762 7.9573-2.9099l-3.8996-3.0106c-1.0808.7245-2.4638 1.1526-4.0577 1.1526-3.1207 0-5.7644-2.1084-6.7104-4.9384H1.5044v3.1041C3.4832 21.3018 7.5183 24 12.24 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.5296 14.2903c-.2412-.7245-.3789-1.4979-.3789-2.2903s.1377-1.5658.3789-2.2903V6.6056H1.5044A11.9917 11.9917 0 000 12c0 1.9356.4636 3.7676 1.5044 5.3944l4.0252-3.1041z"
      />
      <path
        fill="#EA4335"
        d="M12.24 4.7511c1.7663 0 3.3517.6079 4.5966 1.8017l3.4553-3.4552C18.2035 1.1917 15.4824 0 12.24 0 7.5183 0 3.4832 2.6982 1.5044 6.6057l4.0252 3.1041c.9459-2.8301 3.5896-4.9587 6.7104-4.9587z"
      />
    </svg>
  );
}
