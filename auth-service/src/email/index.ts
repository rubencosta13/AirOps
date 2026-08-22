import { sendEmail } from "./email.service";
import { forgotPasswordTemplate } from "./templates/forgot-password";
import { verifyAccountTemplate } from "./templates/verify-account";

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

  async sendAccountRegister(email: string, user: any, token: string) {
    const verifyAccount = new URL("/verify", process.env.FRONTEND_URL);
    verifyAccount.searchParams.set("token", token);
    await sendEmail({
      to: email,
      html: verifyAccountTemplate({
        activateURL: verifyAccount,
        name: user.name,
      }),
      subject: "Verify your AIROPS account!",
    });
  },
};
