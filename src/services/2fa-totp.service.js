/* eslint-disable camelcase, no-mixed-operators */
import * as Speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import db from '../models';

const encoding = 'base32';

/**
 * Two Factor Authentication Service
 */
export default {
  setupSecret: async (email, type) => {
    const { base32, otpauth_url } = Speakeasy.generateSecret({
      name: `Barefoot Nomad - ${email}`,
      issuer: 'Barefoot Nomad',
      length: 20,
    });

    const dataURL = await QRCode.toDataURL(otpauth_url);

    const updatedUser = await db.user.update(
      {
        twoFAType: type,
        twoFASecret: base32,
        twoFADataURL: dataURL,
      }, {
        where: { email },
        returning: true,
        plain: true,
      },
    );

    const { phoneNumber } = updatedUser[1];

    const dataObjects = {
      sms_text_temp: {
        twoFAType: type,
        twoFASecret: base32,
        phoneNumber,
      },
      authenticator_app_temp: {
        twoFAType: type,
        twoFASecret: base32,
        twoFADataURL: dataURL,
      },
      none: {
        twoFAType: type,
        twoFASecret: null,
      },
    };

    return dataObjects[type];
  },
  generate: secret => ({
    token: Speakeasy.totp({
      secret,
      encoding,
    }),
    remaining: (60 - Math.floor((new Date().getTime() / 1000.0 % 60))),
  }),
  get: async (email) => {
    const { twoFAType, twoFASecret, phoneNumber, twoFADataURL } = await db.user.findOne({
      where: { email },
      returning: true,
      plain: true,
    });

    return {
      twoFAType,
      twoFASecret,
      twoFADataURL,
      phoneNumber
    };
  },
  remove: async (email) => {
    const resetResponse = {
      twoFASecret: null,
      twoFAType: 'none',
      twoFADataURL: null,
    };
    await db.user.update(resetResponse, { where: { email } });
    return resetResponse;
  },
  verify: async ({ res, type, secret, token }) => {
    if (type.includes('_temp')) {
      await db.user.update({ twoFAType: type.split('_temp')[0] }, { where: { email: res.locals.user.email } });
    }

    return Speakeasy.totp.verify({
      secret,
      token,
      encoding,
      window: 1,
    });
  },
};
