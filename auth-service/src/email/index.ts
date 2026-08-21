import { sendEmail } from "./email.service";
import { forgotPasswordTemplate } from "./templates/forgot-password";

export const emailService = {
  async sendForgotPassword(email: string, token: string) {
    const resetUrl = new URL("/reset-password", process.env.FRONTEND_URL);

    resetUrl.searchParams.set("token", token);

    await sendEmail({
      to: email,
      html: forgotPasswordTemplate({ resetUrl: resetUrl }),
      subject: "Reset your AIROPS password here",
    });
  },
};
