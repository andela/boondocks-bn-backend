import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import {
  userfactory,
  hotelfactory,
  roomfactory,
  locationfactory
} from './scripts/factories';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';
import requestData from './mock-data/request';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/Requests', () => {
  let token = '';
  let manager = '';
  before(async () => {
    await truncate();
    await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 2, city: 'Nairobi', country: 'Kenya' });
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    manager = await userfactory(requestData.users[0]);
    await userfactory({
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      lineManagerId: manager.id
    });
    token = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain.com',
      isVerified: 1
    });
  });

  before((done) => {
    request(app)
      .post(`${prefix}/notification`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[0])
      .end((err) => {
        done(err);
      });
  });

  it('GET /notification - lineManager should be able to get all notifications from his direct report', (done) => {
    request(app)
      .get(`${prefix}/notification`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.equal('Notifications fetched successfully');
        done();
      });
  });
});
