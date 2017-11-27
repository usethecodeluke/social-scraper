var dynamo = require('dynamodb');
var Joi = require('joi');

const Morsel = dynamo.define('Morsel', {
  hashKey : 'hashtag',
  rangeKey : 'uuid',
  timestamps : true,
  schema : {
    uuid : dynamo.types.uuid(),
    hashtag   : Joi.string().default('None'),
    service   : Joi.string().default('local'),
    name   : Joi.string().default('Anonymous'),
    email   : Joi.string().email().default(''),
    content : Joi.binary(),
    apiId   : Joi.string().default('None')
  },
  indexes : [{
    hashkey : 'hashtag', rangekey : 'createdAt', type : 'local', name : 'createdAtIndex'
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
