export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default-just-for-test-purpose',
    expiresIn: '1d',
  },
};
