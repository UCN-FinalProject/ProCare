import { Resend } from "resend";
import { env } from "~/env.mjs";
import Welcome from "~/Emails/Welcome";

const resend = new Resend(env.RESEND_API_KEY);

export default {
  async sendEmail({ to, subject }: { to: string; subject: string }) {
    return await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [to],
      subject: subject,
      react: Welcome({ email: to }),
    });
  },
} as const;
