import nodemailer from "nodemailer";

if (
  !process.env.SMTP_SERVER ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_USERNAME ||
  !process.env.SMTP_PASSWORD
)
  throw new Error("SMTP environment variables are not set");

export const nodemailerTransponder = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: "SSLv3"
  }
});
