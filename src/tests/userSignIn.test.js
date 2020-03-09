import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../app';
import db from '../models';
import Bcrypt from '../utils/hash';
import truncate from './scripts/truncate';

use(chaiHttp);

const prefix = '/api/v1';
describe('/auth/signin', () => {
  before(async () => {
    await truncate();
    await db.user.create({
      firstName: 'John',
      lastName: 'McCain',
      password: Bcrypt.generateSync('1234567e'),
      email: 'john@mccain.com'
    });
  });
  it('should not login unregistered user', async () => {
    const res = await request(app)
      .post(`${prefix}/auth/signin`)
      .send({
        email: 'unregistered@unregistered.com',
        password: 'unregistered',
      });
    expect(res.status).eql(404);
  });
  it('should not login valid user with wrong password', async () => {
    const res = await request(app)
      .post(`${prefix}/auth/signin`)
      .send({
        email: 'john@mccain.com',
        password: 'wrong_password',
      });
    expect(res.status).eql(400);
  });
  it('should not login user with invalid email', async () => {
    const res = await request(app)
      .post(`${prefix}/auth/signin`)
      .send({
        email: 'john@mccaincom',
        password: '12345678'
      });
    expect(res.status).eql(400);
  });
  it('should login registered user with valid credentials', async () => {
    const res = await request(app)
      .post(`${prefix}/auth/signin`)
      .send({
        email: 'john@mccain.com',
        password: '1234567e',
      });
    expect(res.status).eql(200);
  });
});
