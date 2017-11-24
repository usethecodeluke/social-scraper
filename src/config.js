const env = process.env.NODE_ENV;
const common = {
  port: 8080
};
const config = {
  production: {
    mongodb: {
      host: 'mongodb',
      database: 'fyap-social',
      user: 'userR5B',
      password: 'NVGtqTX28wFnUvLp'
    }
  }
};
export default Object.assign(common, config[env]);
