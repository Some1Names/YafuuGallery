import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Resend's sandbox sender works without verifying a domain, but only
// delivers to the email address the Resend account itself was signed up
// with. Verify a domain in the Resend dashboard and set RESEND_FROM_ADDRESS
// once you're ready to send to arbitrary recipients.
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? "YafuuGallery <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[Email — RESEND_API_KEY not set] To: ${to} | Subject: ${subject}\n${html}`);
    return;
  }

  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) {
    console.error("[sendEmail] Resend error:", error);
    throw new Error("Failed to send email");
  }
}
