import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
});

interface SendMail {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendMail) => {
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
