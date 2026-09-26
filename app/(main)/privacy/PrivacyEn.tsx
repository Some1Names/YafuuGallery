import Link from "next/link";
import LegalPage, { ContactLink, LegalList, LegalSection } from "@/component/LegalPage";

// Written to match what the code actually does (lib/auth.ts, the Prisma
// schema, lib/theme.ts etc.) — update it when that changes, e.g. if
// analytics or a self-service account delete are ever added.
// English version — see PrivacyTh.tsx for Thai; page.tsx picks by locale.
export function PrivacyEn() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="September 26, 2026"
      intro={
        <p>
          YafuuGallery (&ldquo;we&rdquo;) is a small manga reading site run from Thailand. This page explains what
          we collect when you use it, why, and what you can ask us to do with it. We follow Thailand&apos;s Personal
          Data Protection Act (PDPA).
        </p>
      }
    >
      <LegalSection title="What we collect">
        <p>Reading without an account collects nothing about you. When you create an account, we store:</p>
        <LegalList>
          <li>
            <span className="text-fg">Account details</span> — your email address and a securely hashed password
            (we never see or store the password itself). If you sign in with Google instead, we get your name, email
            address and profile picture from Google.
          </li>
          <li>
            <span className="text-fg">Your profile</span> — your display name, the 4-digit tag that goes with it, and
            a profile picture if you upload one.
          </li>
          <li>
            <span className="text-fg">What you do on the site</span> — manga and chapters you favorite, your reading
            progress and history, comments you post, comments you like, and comments you report.
          </li>
          <li>
            <span className="text-fg">Sign-in sessions</span> — when you sign in, we record the IP address and
            browser/device it came from, to keep your session secure.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Why we use it">
        <LegalList>
          <li>To run your account: signing you in, keeping your favorites, and remembering where you stopped reading.</li>
          <li>To show your display name, tag and picture next to comments you post — those are public.</li>
          <li>To email you when you ask for it: verifying your email address and resetting your password. We don&apos;t send newsletters or marketing.</li>
          <li>To keep the site safe: stopping spam and abuse, and reviewing comments readers report.</li>
        </LegalList>
        <p>
          We don&apos;t sell your data, show ads, or use analytics or tracking tools.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and browser storage">
        <p>
          We use two cookies: one to keep you signed in, and one to remember the language you chose. Your browser also saves a few settings on your own device — light or
          dark theme, reading mode, recent searches, and which comments you&apos;ve already seen. These never leave your
          device and aren&apos;t used to track you.
        </p>
      </LegalSection>

      <LegalSection title="Who helps us run the site">
        <p>Your data is stored and handled by these services on our behalf, some of them outside Thailand:</p>
        <LegalList>
          <li>Supabase — our database (accounts, favorites, reading progress, comments)</li>
          <li>Cloudflare R2 — images and chapter files, including profile pictures</li>
          <li>Resend — sends verification and password-reset emails</li>
          <li>Google — only if you choose &ldquo;Sign in with Google&rdquo;</li>
          <li>Our web hosting provider — runs the site itself</li>
        </LegalList>
        <p>They only get what they need to do that job, and we don&apos;t share your data with anyone else unless the law requires it.</p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep your account data while your account exists. You can remove reading history yourself any time from{" "}
          <Link href="/history" className="text-fg underline underline-offset-2 decoration-fg/30 hover:decoration-fg">
            Reading history
          </Link>
          . When your account is deleted, your profile, favorites, reading progress, comments (and replies to them),
          likes and reports are deleted with it. A profile picture you uploaded is removed from storage at our next
          clean-up.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>Under the PDPA you can ask us to:</p>
        <LegalList>
          <li>give you a copy of the personal data we hold about you</li>
          <li>correct it (you can change your display name and picture yourself on your profile)</li>
          <li>delete your account and its data</li>
          <li>stop or limit how we use it, or object to it</li>
        </LegalList>
        <p>
          Message us at <ContactLink /> and we&apos;ll reply within 30 days. If you&apos;re not happy with how we handle
          it, you can also complain to Thailand&apos;s Personal Data Protection Committee (PDPC).
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          YafuuGallery isn&apos;t meant for children under 13, and they shouldn&apos;t create an account. If you&apos;re
          under 20, please ask a parent or guardian before signing up. If you think a child has given us their data,
          message us and we&apos;ll delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          If we change this policy, we&apos;ll update the date at the top of this page. Questions? Message us at{" "}
          <ContactLink />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
