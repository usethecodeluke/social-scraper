import express from 'express';
import sha1 from 'sha1';
import randomstring from 'randomstring';
import { log } from '../log';

import { Morsel, Cron } from 'models';

import { refreshMorsels } from '../utils';

import { checkRecaptcha } from '../utils';

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
  if (hashtag) {
      const morsels = await Morsel.find({'hashtag': hashtag}).sort({date: 'desc'}).limit(limit);
      const now = Date.now();
      let cron = await Cron.find({'hashtag': hashtag});
      if ((!cron.length) || (now - cron[0].date >= 120000)) {
          cron = await Cron.findOneAndUpdate({'hashtag': hashtag}, {'date':Date.now()}, {new:true, upsert:true});
          refreshMorsels(hashtag, cron.last_id);
      }
      return res.send(morsels);
  }
  const morsels = await Morsel.find().limit(limit);
  return res.send({ morsels });
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
  try {
    let morsel = new Morsel({
      hashtag,
      service,
      username,
      content,
      apiId
    });
    morsel = await morsel.save();
    return res.send(201);
  } catch (err) {
    next(err);
  }
});
export default router;
