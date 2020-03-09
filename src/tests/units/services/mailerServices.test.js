import { expect } from 'chai';
import { describe, it } from 'mocha';
import data from '../../mock-data/resetPasswordData';
import Mailer from '../../../services/Mailer.services';

describe('Mailing service', () => {
  it('Should send email successful to the user', async done => new Promise((resolve) => {
    const Mailing = new Mailer();
    Mailing.sendEmail(data.mailObject)
      .then((result) => {
        expect(200).eql(result[0].statusCode);
        resolve();
      }).then(done());
  }));
});
