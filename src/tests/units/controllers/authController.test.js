/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/named */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import AuthController from '../../../controllers/auth.controller';
import db from '../../../models';

const { googleSignIn, facebookSignIn } = AuthController;

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

const { facebook, google } = OAuthData;

describe('Social Authentication', () => {
  beforeEach(async () => {
    await db.user.destroy({
      where: {},
      force: true
    });
  });

  it('should create a Facebook and save him in the db', async () => {
    // eslint-disable-next-line no-shadow
    const { request, response } = facebook;
    const { email } = request.user._json;
    await facebookSignIn(request, response);
    const user = await db.user.findOne({ where: { email } });
    expect(email).eql(user.dataValues.email);
  });

  it('should create a Google and save in in the db', async () => {
    // eslint-disable-next-line no-shadow
    const { request, response } = google;
    const email = request.user.emails[0].value;
    await googleSignIn(request, response);
    const user = await db.user.findOne({ where: { email } });
    expect(email).eql(user.dataValues.email);
  });
});
