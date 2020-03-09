import { expect } from 'chai';
import ErrorHandler from '../../../utils/error';

describe('Error handler constructor', () => {
  it('should be able throw an error when called', (done) => {
    const fcn = () => { throw new ErrorHandler('Invalid details'); };
    expect(fcn).to.throw(Error, 'Invalid details');
    done();
  });
});
