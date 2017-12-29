import * as dynamo from 'dynamodb';
var Joi = require('joi');

const Morsel = dynamo.define('Morsel', {
  hashKey : 'hashtag',
  rangeKey : 'uuid',
  timestamps : true,
  schema : {
    uuid : dynamo.types.uuid(),
    hashtag   : Joi.string(),
    service   : Joi.string().empty('').default('local'),
    name   : Joi.string().empty('').default('anonymous'),
    email   : Joi.string().email().allow(''),
    content : Joi.string().max(250).truncate(),
    apiId   : Joi.string().allow('')
  },
  indexes : [{
    hashKey : 'hashtag', rangeKey : 'createdAt', type : 'local', name : 'createdAtIndex'
  }]
});

/**
 * @swagger
 * definitions:
 *   Morsel:
 *     type: object
 *     properties:
 *       _id:
 *         type: UUID
 *         default: objectId
 *       hashtag:
 *         type: string
 *         default: None
 *       service:
 *         type: string
 *         default: local
 *       name:
 *         type: string
 *         default: Anonymous
 *       email:
 *         type: email
 *         default: None
 *       content:
 *         type: binary
 *         default: None
 *       apiId:
 *         type: string
 *         default: None
 *       createdAt:
 *         type: Date
 *         default: now
 *       updatedAt:
 *         type: Date
 *         default: undefined
 */

export default Morsel;
