import express from 'express';
import sha1 from 'sha1';
import randomstring from 'randomstring';
const uuidv1 = require('uuid/v1');

import { log } from '../log';
import { Morsel, Cron } from 'models';
import { refreshMorsels, checkRecaptcha } from '../utils';

const router = new express.Router();

/**
 * @swagger
 * /morsel:
 *   get:
 *     summary: morsel list
 *     description: return morsel list
 *     tags:
 *       - Morsel
 *     responses:
 *       200:
 *         description: morsels
 *         schema:
 *           type: object
 *           properties:
 *             morsels:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Morsel'
 */
router.get('/', async (req, res, next) => {
  const hashtag = 'fuckyouajitpai';
  let limit = 30;
  if (req.query.limit != undefined) {
      limit = parseInt(req.query.limit);
  }
  if (isNaN(limit)) {
      var err = new Error('limit must be of type int');
      return next(err);
  }
  if (limit > 50) {
      var err = new Error('Over limit request');
      return next(err);
  }
  await Morsel
      .query(hashtag)
      .usingIndex('createdAtIndex')
      .descending()
      .limit(limit)
      .exec( function(err, morsels) {
          if (err) {
              return next(err);
          }
          return res.send(morsels);
      });
  const now = Date.now();
  let cronDate = undefined;
  let id = 1;
  Cron.get(hashtag, async function(err, cron) {
      if (err) {
          console.log(err);
      }
      try {
          cronDate = cron.get('createdAt');
          cronDate = new Date(cronDate);
          id = cron.get('lastId');
      } catch(err) {
          console.log(err);
      }
      if ((cron == undefined) || (now - cronDate >= 120000)) {
          let last_id = await refreshMorsels(hashtag, id);
          Cron.create({hashtag: hashtag, lastId: last_id}, function(err, new_cron) {
              if (err) {
                  console.log(err);
                  return;
              }
              console.log('refresh complete! new id: ', last_id);
          });
      }
  });
});


/**
 * @swagger
 * /morsel:
 *   post:
 *     summary: create morsel (comment)
 *     description: create (anonymous) comment from website
 *     tags:
 *       - Morsel
 *     parameters:
 *       - name: morsel
 *         in: body
 *         required: true
 *         description: JSON morsel object
 *         schema:
 *           type: object
 *           properties:
 *             hashtag:
 *               type: string
 *               default: None
 *             service:
 *               type: string
 *               default: local
 *             username:
 *               type: string
 *               default: Anonymous
 *             content:
 *               type: string
 *               default: None
 *             apiId:
 *               type: string
 *               default: None
 *     responses:
 *       201:
 *         description: create new user
 */
router.post('/', async (req, res, next) => {
  const { hashtag, service, name, email, content, apiId } = req.body;
  //let cap = await checkRecaptcha(req.body['g-recaptcha-response'], req.clientIp);
  //if (!cap) {
//      var err = new Error('failed to verify recaptcha');
//      return next(err);
//  }
  Morsel.create({
    hashtag: hashtag,
    service: service,
    name: name,
    email: email,
    content: content,
    apiId: apiId
    },
    function(err, morsel) {
      if (err) {
          return next(err);
      }
      return res.sendStatus(201);
  });
});
export default router;
