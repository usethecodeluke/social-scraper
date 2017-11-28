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
router.get('/', async (req, res) => {
  const hashtag = 'fuckyouajitpai';
  let limit = 30;
  if (req.query.limit != undefined) {
      limit = parseInt(req.query.limit);
  }
  if (isNaN(limit)) {
      var err = new Error('limit must be of type int');
      res.status(400).json({ error: err.toString() });
  }
  if (limit > 30) {
      var err = new Error('Over limit request');
      res.status(400).json({ error: err.toString() });
  }
  const morsels = await Morsel
      .query(hashtag)
      .usingIndex('createdAtIndex')
      .descending()
      .limit()
      .exec();
  const now = Date.now();
  Cron.get(hashtag, function(err, cron) {
      if (err) {
          console.log(err);
      }
      if ((cron == undefined) || (now - cron.createdAt >= 120000)) {
          refreshMorsels(hashtag, cron).then(function(last_id){
              Cron.create({hashtag: hashtag, last_id: last_id}, function(err, new_cron) {
                  console.log('refresh complete! new id: ', new_cron.last_id);
              });
          });
      }
  });
  return res.send(morsels);
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
  const { hashtag, service, username, content, apiId } = req.body;
  if (! checkRecaptcha(req)) {
      // bad recaptcha
      var err = new Error('failed to verify recaptcha');
      return res.status(400).json({ error: err.toString() });
  }
  Morsel.create({
    uuid: uuidv1(),
    hashtag: hashtag,
    service: service,
    username: username,
    content: content,
    apiId: apiId
    },
    function(err, morsel) {
      if (err) {
          return next(err);
      }
      return res.send(201);
  });
});
export default router;
