import { request, should, use } from 'chai';
import chaiHttp from 'chai-http';
import truncate from './scripts/truncate';
import { userfactory } from './scripts/factories';
import twoFAData from './mock-data/2fa-data';
import tokenizer from '../utils/jwt';
import app from '../app';
import twoFA from '../services/2fa-totp.service';

should();
use(chaiHttp);

const PREFIX = '/api/v1';

describe('"Two Factor Authenticator" controller', async () => {
  let token1 = '';
  let token2 = '';
  let token3 = '';
  let userObj;
  before(async () => {
    await truncate();
    await userfactory(twoFAData.users[0]);
    await userfactory(twoFAData.users[2]);
    userObj = await userfactory(twoFAData.users[1]);
    token1 = await tokenizer.signToken(twoFAData.users[0]);
    token2 = await tokenizer.signToken(twoFAData.users[1]);
    token3 = await tokenizer.signToken(twoFAData.users[2]);
  });

  describe('PATCH /2fa/totp/setup - ', () => {
    it('should return 400 when the user doesn\'t have a phoneNumber on "sms_text_temp"', (done) => {
      request(app)
        .patch(`${PREFIX}/2fa/totp/setup`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ twoFAType: 'sms_text_temp' })
        .end((err, res) => {
          res.status.should.be.equal(400);
          done(err);
        });
    });
    it('should return 200 on success', (done) => {
      request(app)
        .patch(`${PREFIX}/2fa/totp/setup`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ twoFAType: 'authenticator_app_temp' })
        .end((err, res) => {
          res.status.should.be.equal(200);
          done(err);
        });
    });
  });

  describe('GET /2fa/totp/setup - ', () => {
    it('should return 200 on success', (done) => {
      request(app)
        .get(`${PREFIX}/2fa/totp/setup`)
        .set('Authorization', `Bearer ${token2}`)
        .end((err, res) => {
          res.status.should.be.equal(200);
          done(err);
        });
    });
  });

  describe('PATCH /2fa/totp/disable - ', () => {
    it('should return 200 on success', (done) => {
      request(app)
        .patch(`${PREFIX}/2fa/totp/disable`)
        .set('Authorization', `Bearer ${token2}`)
        .end((err, res) => {
          res.status.should.be.equal(200);
          done(err);
        });
    });
  });

  describe('POST /2fa/totp/verify - ', () => {
    it('should return 400 when user doesn\'t have 2FA enabled', (done) => {
      request(app)
        .post(`${PREFIX}/2fa/totp/verify`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ token: '000000' })
        .end((err, res) => {
          res.status.should.be.equal(400);
          res.body.message.should.be.equal('Invalid TOTP token');
          done(err);
        });
    });
    it('should return 200 on success', (done) => {
      const { token } = twoFA.generate(twoFAData.users[2].twoFASecret);
      request(app)
        .post(`${PREFIX}/2fa/totp/verify`)
        .set('Authorization', `Bearer ${token3}`)
        .send({ token })
        .end((err, res) => {
          res.status.should.be.equal(200);
          done(err);
        });
    });
    it('should return 400 on invalid token', (done) => {
      request(app)
        .post(`${PREFIX}/2fa/totp/verify`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ token: '000000' })
        .end((err, res) => {
          res.status.should.be.equal(400);
          done(err);
        });
    });
  });
  describe('POST /2fa/totp/send-token-text - ', () => {
    it('should return 200 on success', (done) => {
      request(app)
        .post(`${PREFIX}/2fa/totp/send-token-text`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          secret: userObj.twoFASecret,
          phoneNumber: userObj.phoneNumber,
        })
        .end((err, res) => {
          res.status.should.be.equal(200);
          done(err);
        });
    });
  });
});
