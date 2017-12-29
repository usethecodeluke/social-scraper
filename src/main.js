import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import routes from 'routes';
import cors from 'cors';
import log from 'log';
import config from 'config';
import { errorHandle, db } from 'utils';

const requestIp = require('request-ip');

db.init();

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  log.error('uncaughtException:', err);
});

const app = express();

var whitelist = [/fuckyouajitpai\.com$/, "72.32.180.178", "127.0.0.1", "localhost"]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No!'));
    }
  },
  "methods": "GET,HEAD,POST"
}

app.use(requestIp.mw())
app.use(cors(whitelist));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use(errorHandle);

const port = config.port;
app.listen(port, () => {
  log.info(`App is listening on ${port}.`);
});

export default app;
