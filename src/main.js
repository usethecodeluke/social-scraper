import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import routes from 'routes';
import cors from 'cors';
import log from 'log';
import config from 'config';
import { errorHandle, db } from 'utils';

db.init();

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  log.error('uncaughtException:', err);
});

const app = express();

app.use(cors({
  "origin": [/fuckyouajitpai\.com$/, "72.32.180.178"],
  "methods": "GET,HEAD,POST"
}));
app.use(bodyParser.json({
  limit: '1mb'
}));

app.use('/', routes);

app.use(errorHandle);

const port = config.port;
app.listen(port, () => {
  log.info(`App is listening on ${port}.`);
});

export default app;
