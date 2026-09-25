import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { ContactLink, LegalList, LegalSection } from "@/component/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using YafuuGallery: accounts, comments, the manga on the site, and takedown requests.",
};

const linkClass = "text-fg underline underline-offset-2 decoration-fg/30 hover:decoration-fg";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="September 26, 2026"
      intro={
        <p>
          By using YafuuGallery, you agree to these terms. They&apos;re written to be short and readable — if anything
          is unclear, message us at <ContactLink />.
        </p>
      }
    >
      <LegalSection title="The manga on YafuuGallery">
        <p>
          YafuuGallery hosts original manga and translations. Original works belong to their creators. Translations
          are published with the permission of the people who own the original work. Either way, the stories and art
          belong to their owners, not to us or to you — please read them here and don&apos;t re-upload, sell or
          redistribute them elsewhere.
        </p>
      </LegalSection>

      <LegalSection title="Copyright and takedown requests">
        <p>
          If you own the rights to a work on YafuuGallery and it&apos;s here without your permission, message us at{" "}
          <ContactLink /> with:
        </p>
        <LegalList>
          <li>the title (and chapters) you&apos;re asking about, with a link</li>
          <li>who you are, and how you own or represent the rights to it</li>
        </LegalList>
        <p>We&apos;ll look into it and take the work down promptly if the request checks out.</p>
      </LegalSection>

      <LegalSection title="Your account">
        <LegalList>
          <li>Give a real email address, and keep your password to yourself — you&apos;re responsible for what happens on your account.</li>
          <li>One person per account. Don&apos;t impersonate someone else with your display name or picture.</li>
          <li>
            You can ask us to delete your account at any time (see the{" "}
            <Link href="/privacy" className={linkClass}>
              privacy policy
            </Link>
            ).
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Comments">
        <p>Comments are public. Keep them about the manga, and don&apos;t post:</p>
        <LegalList>
          <li>harassment, threats, or hate toward anyone</li>
          <li>spam, ads, or scam links</li>
          <li>anyone&apos;s personal information</li>
          <li>sexual content involving minors, or anything else illegal</li>
          <li>links to pirated copies of the works on this site</li>
        </LegalList>
        <p>
          You keep ownership of what you write, but you let us show it on the site. Readers can report comments, and
          we may hide or delete any comment, or suspend or delete an account, that breaks these rules.
        </p>
      </LegalSection>

      <LegalSection title="Creators">
        <p>
          If you publish manga here, you confirm you created it or have the right to publish it (including permission
          for any translation). You keep all rights to your work; you let us host and show it on YafuuGallery until you
          remove it or ask us to.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          YafuuGallery is a small site run for free. We try to keep it working and your data safe, but we provide it
          &ldquo;as is&rdquo;, without guarantees, and we may change or stop parts of it. As far as the law allows,
          we&apos;re not liable for losses from using it or from it being unavailable.
        </p>
      </LegalSection>

      <LegalSection title="Changes and governing law">
        <p>
          If we change these terms, we&apos;ll update the date at the top of this page; continuing to use the site
          means you accept the new version. These terms are governed by the laws of Thailand. Questions? Message us at{" "}
          <ContactLink />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
