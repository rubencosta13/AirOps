export interface SendMail {
  to: string;
  subject: string;
  html: string;
}

export const sentEmails: SendMail[] = [];

export const sendEmail = async (email: SendMail) => {
  sentEmails.push(email);
};
