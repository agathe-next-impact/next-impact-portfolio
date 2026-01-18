import nodemailer from "nodemailer"; 

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
}

export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: any[];
  from?: string; // Add this line
}

export async function sendMail(options: MailOptions) {
  const transporter = getTransporter();
  return transporter.sendMail(options);
}
