import { OAuth2Client } from 'google-auth-library';
import { I18nContext } from 'nestjs-i18n';

export const verifyToken = async (token: string) => {
  let i18n: I18nContext;
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { aud } = payload;
  if (aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error(i18n.t('user.INVALID_USER'));
  }
  return payload;
};

export const getAccessToken = async (code: string) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
  );
  const { tokens } = await client.getToken({
    code,
  }); // exchange code for tokens
  console.log(tokens);
  return tokens;
};
