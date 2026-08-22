export const verifyAccountTemplate = ({
  activateURL,
  name,
}: {
  activateURL: URL | string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <body>
    <h1>Confirm your account</h1>

    <p>
      Hey ${name}! To activate your account please click on the link below
    </p>

    <a href="${activateURL}">
      Activate Account
    </a>

    <p>
      This link will expire in 15 minutes.
    </p>
  </body>
</html>
`;
