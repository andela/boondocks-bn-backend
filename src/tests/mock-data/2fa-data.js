import Hash from '../../utils/hash';

const request = {
  users: [
    {
      id: 35,
      firstName: 'User1',
      lastName: 'Case1',
      email: 'user1@case.com',
      password: Hash.generateSync('12345678'),
      role: 'requester',
      twoFAType: 'none',
      twoFASecret: null,
      twoFADataURL: null,
    },
    {
      id: 36,
      firstName: 'User2',
      lastName: 'Case2',
      email: 'user2@case.com',
      password: Hash.generateSync('12345678'),
      role: 'requester',
      phoneNumber: '+250788888888',
      twoFAType: 'none',
      twoFASecret: null,
      twoFADataURL: null,
    },
    {
      id: 37,
      firstName: 'User3',
      lastName: 'Case4',
      email: 'user3@case.com',
      password: Hash.generateSync('12345678'),
      role: 'requester',
      phoneNumber: '+250788888888',
      twoFAType: 'authenticator_app_temp',
      twoFASecret: 'HRYVGVLQKU4GOZBDPFJSGLTFHAYT4VD3',
      twoFADataURL: 'data:image/png;base64,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',
    },
  ]
};

export default request;
