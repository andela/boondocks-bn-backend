/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/named */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import AuthController, { getTokenAfterSignIn } from '../../../controllers/auth.controller';
import db from '../../../models';

const { googleSignIn, facebookSignin } = AuthController;

const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const OAuthData = {
  facebook: {
    response,
    request: {
      user: {
        _json:
          {
            id: '10220876652049896',
            email: 'gildniy05@gmail.com',
            last_name: 'Niyigena',
            first_name: 'Gildas'
          }
      }
    }
  },
  google: {
    response,
    request: {
      user: {
        displayName: 'Gildas Niyigena',
        emails: [{
          value: 'gildniy05@gmail.com'
        }]
      }
    }
  }
};

describe('Social Authentication', () => {
  beforeEach(async () => {
    await db.user.destroy({
      where: {},
      force: true
    });
  });

  it('should fail to give the Token when the response is not from OAuth', async () => {
    const data = await getTokenAfterSignIn(response, OAuthData.facebook.request.user);
    expect(data.statusCode)
      .eql(500);
  });

  it('should create a Facebook and save him in the db', async () => {
    const { email } = OAuthData.facebook.request.user._json;
    await facebookSignin(OAuthData.facebook.request, OAuthData.facebook.response);
    const user = await db.user.findOne({ where: { email } });
    expect(email)
      .eql(user.dataValues.email);
  });

  it('should create a Google and save in in the db', async () => {
    const email = OAuthData.google.request.user.emails[0].value;
    await googleSignIn(OAuthData.google.request, OAuthData.google.response);
    const user = await db.user.findOne({ where: { email } });
    expect(email)
      .eql(user.dataValues.email);
  });
});
