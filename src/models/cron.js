import * as dynamo from 'dynamodb';
var Joi = require('joi');

const Cron = dynamo.define('Cron', {
  hashKey : 'hashtag',
  timestamps : true,
  schema : {
    hashtag   : Joi.string().default('None'),
    lastId   : Joi.string().default('0')
  }
});

export default Cron;
