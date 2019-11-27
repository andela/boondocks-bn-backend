import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import FormData from 'form-data';
import { resolve } from 'path';
import fileService from '../../../services/files.service';
import { file, submitForm } from '../utils/formDataUtils';


chai.use(chaiHttp);

describe('Unit tests file service', () => {
  before((done) => {
    done();
  });

  it('Should upload an image when the image is not available', (done) => {
    const form = new FormData();
    const parser = fileService.upload('small0');

    form.append('name', 'Multer');
    form.append('small0', file('small0.dat'));

    submitForm(parser, form, (err) => {
      assert.equal(err instanceof Error, true);
      done();
    });
  });

  it('Should upload an image when the image is available', (done) => {
    const form = new FormData();
    const parser = fileService.upload('image');

    form.append('name', 'Multer');
    form.append('image', file(resolve(__dirname, '../../mock-data/images/search.png')));

    submitForm(parser, form, (err) => {
      assert.equal(err instanceof Error, true);
      done();
    });
  });
});
