import { expect } from 'chai';
import { describe, it } from 'mocha';
import hotelService from '../../../services/hotel.service';
import db from '../../../models';
import { hotelfactory } from '../../scripts/factories';

describe('Hotel service', () => {
  before(async () => {
    await db.hotel.destroy({ where: {}, force: true });
    await db.location.destroy({ where: {}, force: true });

    await hotelfactory({
      id: 99,
      locationId: 1,
      name: 'Test hotel',
      image: '',
      street: 'kk 127',
      description: 'best ever hotel',
      services: 'service 1, service 2',
      userId: 1
    });
  });
  it('getHotelById() Should return hotel by id', async done => new Promise((resolve) => {
    hotelService.getHotelById(99)
      .then((result) => {
        expect(result.name).eql('Test hotel');
        resolve();
      }).then(done());
  }));
});
