// eslint-disable-next-line no-unused-vars
const randomPw = len => Array(len).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');

// eslint-disable-next-line import/prefer-default-export
export { randomPw };
