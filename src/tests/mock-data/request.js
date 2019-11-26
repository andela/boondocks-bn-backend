import Hash from '../../utils/hash';

const request = {
  users: [
    {
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager'
    },
    {
      firstName: 'new',
      lastName: 'test',
      email: 'testnew@email.co',
      password: Hash.generateSync('bttj6bt'),
      lineManagerId: 1
    },
    {
      firstName: 'new',
      lastName: 'test',
      email: 'testnew@email.co',
      password: Hash.generateSync('bttj6bt'),
      lineManagerId: 2
    },
    {
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase1@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager'
    },
    {
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase32@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager'
    }
  ]
};

export default request;
