const env = process.env.NODE_ENV;
const common = {
  port: 8080
};
const config = {
  production: {
    mongodb: {
      host: 'mongodb',
      database: 'fyap-social',
      user: 'user0OD',
      password: 'q6eF6SSMHWaG3mj4'
    }
  }
};
export default Object.assign(common, config[env]);
