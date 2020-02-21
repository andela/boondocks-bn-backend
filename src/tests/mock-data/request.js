import Hash from '../../utils/hash';

const request = {
  users: [
    {
      id: 33,
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager',
      phoneNumber: '+250789390266',
      isVerified: true,
    },
    {
      id: 34,
      firstName: 'new',
      lastName: 'test',
      email: 'testnew@email.com',
      password: Hash.generateSync('bttj6bt'),
      lineManagerId: 33
    },
    {
      id: 31,
      firstName: 'new',
      lastName: 'test',
      email: 'testnew@email.co',
      password: Hash.generateSync('bttj6bt'),
      lineManagerId: 33
    },
    {
      id: 30,
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase1@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager'
    },
    {
      id: 29,
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase32@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager'
    }
  ]
};

export default request;
