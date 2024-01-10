import { Resend } from "resend";
import { env } from "~/env.mjs";
import Welcome from "~/Emails/Welcome";

const resend = new Resend(env.RESEND_API_KEY);

export default {
  async sendEmail({
    fullName,
    to,
    subject,
  }: {
    fullName: string;
    to: string;
    subject: string;
  }) {
    return await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [to],
      subject: subject,
      react: Welcome({ name: fullName }),
    });
  },
} as const;
