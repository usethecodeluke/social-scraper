const env = process.env;
const common = {
  port: 8080
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
      host: env.MONGODB_ROUTE,
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
