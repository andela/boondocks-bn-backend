import { should } from 'chai';
import { schemaErrorMessage } from '../../../utils/schemas';

should();

describe('schemas', () => {
  it('should return the error message', () => {
    (typeof schemaErrorMessage('')).should.be.equal('function');
  });
});
