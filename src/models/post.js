import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  _id: String,
  hashtag: String,
  url: String,
  service: String,
  username: String,
  content: String
});

PostSchema.options.toJSON = PostSchema.options.toJSON || {};
PostSchema.options.toJSON.transform = (doc, ret) => {
  return ret;
};

const Post = mongoose.model('post', PostSchema);

/**
 * @swagger
 * definitions:
 *   Post:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         default: objectId
 *       hashtag:
 *         type: string
 *         default: HASHTAG
 *       url:
 *         type: string
 *         default: URL
 *       service:
 *         type: string
 *         default: SERVICE
 *       username:
 *         type: string
 *         default: USERNAME
 *       content:
 *         type: string
 *         default: CONTENT
 */

export default Post;
