export const forgotPasswordTemplate = ({
  resetUrl,
}: {
  resetUrl: URL | string;
}) => `
<!DOCTYPE html>
<html>
  <body>
    <h1>Reset your password</h1>

    <p>
      We received a request to reset your password.
    </p>

    <a href="${resetUrl}">
      Reset password
    </a>

    <p>
      This link will expire in 15 minutes.
    </p>
  </body>
</html>
`;
