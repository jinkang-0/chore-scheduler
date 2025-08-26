"use server";

import { nodemailerTransponder } from "@/lib/config/messaging";

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_SENDER_NAME || !process.env.SMTP_SENDER_EMAIL)
    throw new Error(
      "SMTP_SENDER_NAME and SMTP_SENDER_EMAIL must be set in the environment variables"
    );

  return await nodemailerTransponder.sendMail({
    from: {
      name: process.env.SMTP_SENDER_NAME,
      address: process.env.SMTP_SENDER_EMAIL
    },
    to,
    subject,
    html
  });
}
