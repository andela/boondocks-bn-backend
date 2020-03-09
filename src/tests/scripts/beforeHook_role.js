/* eslint-disable import/no-extraneous-dependencies */
import { request } from 'chai';
import app from '../../app';
import db from '../../models';
import Bcrypt from '../../utils/hash';
import truncate from './truncate';

const prepareForTest = async () => {
  await truncate();
  await db.user.create({
    id: 56,
    firstName: 'Super',
    lastName: 'Administrator',
    password: Bcrypt.generateSync('1234567e'),
    email: 'super@administrator.com',
    role: 'super_administrator'
  });
  const res = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'super@administrator.com',
      password: '1234567e'
    });
  const superAdministratorTokenExport = `Bearer ${res.body.data.token}`;
  await db.user.create({
    id: 57,
    firstName: 'Random',
    lastName: 'Requester',
    password: Bcrypt.generateSync('1234567e'),
    email: 'random@requester.com',
    role: 'requester'
  });
  const res2 = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'random@requester.com',
      password: '1234567e'
    });
  const requesterTokenExport = `Bearer ${res2.body.data.token}`;
  await db.user.create({
    id: 673,
    firstName: 'Lin',
    lastName: 'Managr',
    password: Bcrypt.generateSync('1234567e'),
    email: 'line@manager123.com',
    role: 'manager'
  });
  const res3 = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'line@manager123.com',
      password: '1234567e'
    });
  const managerTokenExport = `Bearer ${res3.body.data.token}`;
  return {
    superAdministratorTokenExport,
    requesterTokenExport,
    managerTokenExport
  };
};
export default prepareForTest;
