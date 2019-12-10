import chaiHttp from 'chai-http';
import { use, request, expect, should } from 'chai';
import { resolve } from 'path';
import fs from 'fs';
import app from '../app';
import db from '../models';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import { hotelfactory, locationfactory, likesfactory } from './scripts/factories';
import truncate from './scripts/truncate';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/hotels', () => {
  let token = '';
  let requesterToken = '';
  let notOwnerToken = '';

  before(async () => {
    await truncate();

    await db.user.create({
      id: 1,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain6.com',
      role: 'travel_administrator'
    });
    await db.user.create({
      id: 2,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      role: 'requester'
    });
    await db.user.create({
      id: 3,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain00.com',
      role: 'travel_administrator'
    });

    await locationfactory({
      id: 80,
      country: 'Rwanda',
      city: 'kigali'
    });
    await locationfactory({
      id: 81,
      country: 'Kenya',
      city: 'Nairobi'
    });

    await hotelfactory({
      id: 82,
      locationId: 81,
      name: 'Test hotel',
      image: '',
      street: 'kk 127',
      description: 'best ever hotel',
      services: 'service 1, service 2',
      userId: 1
    });

    await likesfactory({ userId: 1, hotelId: 82, unliked: 1 });

    await hotelfactory({
      id: 83,
      locationId: 80,
      name: 'Test hotel',
      image: '',
      street: 'kk 127',
      description: 'best ever hotel',
      services: 'service 1, service 2',
      userId: 1
    });

    await likesfactory({ userId: 1, hotelId: 83, liked: 1 });

    token = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain6.com',
      isVerified: 1,
      role: 'travel_administrator'
    });

    requesterToken = await tokenizer.signToken({
      id: 2,
      email: 'john@mccain.com',
      isVerified: 1,
      role: 'requester'
    });
    notOwnerToken = await tokenizer.signToken({
      id: 2,
      email: 'john@mccain00.com',
      isVerified: 1,
      role: 'travel_administrator'
    });
  });

  it('POST /hotels/:hotelId/rooms - should be able to add hotel rooms', (done) => {
    request(app)
      .post(`${prefix}/hotels/82/rooms`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Virunga')
      .field('description', 'Best of the best')
      .field('type', 'VIP')
      .field('cost', 4000)
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        done();
      });
  });

  it('POST /hotels/:hotelId/rooms - should be able to add hotel rooms when you are not a travel admin', (done) => {
    request(app)
      .post(`${prefix}/hotels/82/rooms`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .field('name', 'Virunga')
      .field('description', 'Best of the best')
      .field('type', 'VIP')
      .field('cost', 4000)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        done();
      });
  });

  it('POST /hotels/:hotelId/rooms - should upload room image if image is provided', (done) => {
    request(app)
      .post(`${prefix}/hotels/82/rooms`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Virunga')
      .field('description', 'Best of the best')
      .field('type', 'VIP')
      .field('cost', 4000)
      .attach('image', resolve(__dirname, 'mock-data/images/search.png'))
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        done();
      });
  });

  it('POST /hotels/:hotelId/rooms - should not add rooms if the user is not the owner of the hotel', (done) => {
    request(app)
      .post(`${prefix}/hotels/82/rooms`)
      .set('Authorization', `Bearer ${notOwnerToken}`)
      .field('name', 'Virunga')
      .field('description', 'Best of the best')
      .field('type', 'VIP')
      .field('cost', 4000)
      .end((err, res) => {
        res.status.should.be.eql(403);
        done();
      });
  });

  it('POST /hotels - should not be able to create a new hotel when user is not a travel admin', (done) => {
    request(app)
      .post(`${prefix}/hotels`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .field('name', 'Test hotel')
      .field('description', 'Best of the best')
      .field('services', 'All services')
      .field('street', 'KK 15 st')
      .field('city', 'Bujumbura')
      .field('country', 'Burundi')
      .attach('image', resolve(__dirname, 'mock-data/images/search.png'))
      .end((err, res) => {
        expect(res.status).to.eql(403);
        done();
      });
  });

  it('POST /hotels - should be able to upload hotel image when provided', (done) => {
    request(app)
      .post(`${prefix}/hotels`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test hotel')
      .field('description', 'Best of the best')
      .field('services', 'All services')
      .field('street', 'KK 15 st')
      .field('city', 'Las Vegas')
      .field('country', 'Rwandaa')
      .attach('image', resolve(__dirname, 'mock-data/images/search.png'))
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        done();
      });
  });

  it('POST /hotels - Delete uploaded image if validation fails', (done) => {
    fs.copyFileSync(resolve(__dirname, 'mock-data/images/search.png'), resolve(__dirname, 'mock-data/images/temp/search.png'));
    request(app)
      .post(`${prefix}/hotels`)
      .set('Authorization', `Bearer ${token}`)
      .field('description', 'Best of the best')
      .field('services', 'All services')
      .field('street', 'KK 15 st')
      .field('city', 'Kigali')
      .field('country', 'Rwanda')
      .attach('image', resolve(__dirname, 'mock-data/images/temp/search.png'))
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('POST /hotels - Should not create a hotel with same name in one location', (done) => {
    request(app)
      .post(`${prefix}/hotels`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test hotel')
      .field('description', 'Best of the best')
      .field('services', 'All services')
      .field('street', 'KK 15 st')
      .field('city', 'kigali')
      .field('country', 'Rwanda')
      .end((err, res) => {
        res.status.should.be.eql(409);
        done();
      });
  });

  it('PATCH hotels/:hotelId/like - user should be able to like a hotel', (done) => {
    request(app)
      .patch(`${prefix}/hotels/82/like`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data.likesCount).to.eql('1');
        done();
      });
  });

  it('GET /hotels - should be retrieve hotels with likes', (done) => {
    request(app)
      .get(`${prefix}/hotels`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data[0].likesCount).to.eql('1');
        done();
      });
  });

  it('GET /hotels/:hotelId - should be retrieve a hotel with likes and rooms', (done) => {
    request(app)
      .get(`${prefix}/hotel/82`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data.likesCount).to.eql('1');
        done();
      });
  });

  it('PATCH hotels/:hotelId/like - user should be able to undo like', (done) => {
    request(app)
      .patch(`${prefix}/hotels/82/like`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data.likesCount).to.eql('0');
        done();
      });
  });

  it('PATCH hotels/:hotelId/like - user should not be able to like a hotel which doesn\'t exist', (done) => {
    request(app)
      .patch(`${prefix}/hotels/84/like`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('PATCH hotels/:hotelId/unlike - user should be able to unlike a hotel', (done) => {
    request(app)
      .patch(`${prefix}/hotels/83/unlike`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data.unLikesCount).to.eql('1');
        done();
      });
  });

  it('PATCH hotels/:hotelId/unlike - user should be able to undo unlike', (done) => {
    request(app)
      .patch(`${prefix}/hotels/83/unlike`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        const { data } = res.body;
        expect(data.unLikesCount).to.eql('0');
        done();
      });
  });
});
