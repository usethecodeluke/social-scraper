const env = process.env.NODE_ENV;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_ROUTE = process.env.MONGODB_ROUTE;
const MONGODB_ADMIN_PASSWORD = process.env.MONGODB_PASSWORD;

const common = {
  port: 8080
};
const config = {
  develop: {
    mongodb: {
      host: '127.0.0.1',
      database: 'fyap'
    }
  },
  production: {
    mongodb: {
      user: 'admin',
      password: MONGODB_ADMIN_PASSWORD,
      host: MONGODB_ROUTE,
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
