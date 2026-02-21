import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendMail({ to, subject, html, attachments }: { to: string | string[], subject: string, html: string, attachments?: any[] }) {
  const from = `"Next Impact" <${process.env.NODEMAILER_USER}>`;

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    attachments,
  });
}
