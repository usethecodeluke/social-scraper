const env = process.env.NODE_ENV;
const common = {
  port: 8880
};
const config = {
  develop: {
    mongodb: {
      host: '127.0.0.1',
      database: 'example'
    }
  },
  production: {
    mongodb: {
      user: env.MONGODB_USER,
      password: env.MONGODB_PASSWORD,
      host: '127.0.0.1',
      database: 'fyap-social'
    }
  },
  test: {
    mongodb: {
      host: '127.0.0.1',
      database: 'example-test'
    }
  }
};
export default Object.assign(common, config[env]);
