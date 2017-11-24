import express from 'express';
import sha1 from 'sha1';
import randomstring from 'randomstring';

import { Post } from 'models';

const router = new express.Router();

/**
 * @swagger
 * /post:
 *   get:
 *     summary: post list
 *     description: return post list
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: posts
 *         schema:
 *           type: object
 *           properties:
 *             posts:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 */
router.get('/', async (req, res) => {
  const posts = await Post.find();
  return res.send({ posts });
});
export default router;
