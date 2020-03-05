import messenger from '../services/sms.service';
import twoFA from '../services/2fa-totp.service';
import Responses from '../utils/response';

const { handleSuccess, handleError } = Responses;
const { setupSecret, get, remove, verify, generate } = twoFA;

const totpSetup = async (req, res) => {
  const data = await setupSecret(res.locals.user.email, req.body.twoFAType);

  if (req.body.twoFAType === 'sms_text_temp' && !data.phoneNumber) {
    return handleError(
      400,
      'You need to set a phoneNumber to activate 2FA with SMS.',
      res,
    );
  }

  return handleSuccess(200, 'TOTP Secret created', res, data);
};

const totpGet = async (req, res) => handleSuccess(
  200,
  'TOTP Secret retrieved',
  res,
  await get(res.locals.user.email)
);

const totpDisable = async (req, res) => handleSuccess(
  200,
  'TOTP Secret removed',
  res,
  await remove(res.locals.user.email)
);

const totpVerify = async (req, res) => {
  const { type, secret, phoneNumber, dataURL } = res.locals.user.twoFA;
  if (type === 'none') {
    return handleError(400, 'User doesn\'t have 2FA enabled.', res);
  }

  const isTokenValid = await verify({
    res,
    type,
    secret,
    token: req.body.token,
  });

  const tokenMethod = type.includes('sms_text') ? { phoneNumber } : { twoFADataURL: dataURL };

  const data = { twoFAType: type, twoFASecret: secret, ...tokenMethod };

  if (!isTokenValid) {
    return handleError(400, 'Invalid TOTP token', res);
  }

  return handleSuccess(200, 'Valid TOTP token', res, { ...data,
    isTokenValid,
  });
};

const totpSendTokenText = async (req, res) => {
  const { secret, phoneNumber } = req.body;
  const { token } = generate(secret);
  const messageString = `Your 6 Digit 60 seconds expiration PassCode is: ${token}`;
  await messenger(phoneNumber, messageString);

  return handleSuccess(200, 'TOTP token sent', res, {
    twoFAType: 'sms_text',
    twoFASecret: secret,
    phoneNumber,
    tokenData: {
      token,
      message: messageString,
    },
  });
};

export default {
  totpSetup,
  totpGet,
  totpDisable,
  totpVerify,
  totpSendTokenText,
};
