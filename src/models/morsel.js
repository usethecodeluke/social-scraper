import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MorselSchema = new Schema({
  hashtag: { type: String, default: "None" },
  service: { type: String, default: "local" },
  username: { type: String, default: "Anonymous" },
  content: { type: String, default: "" },
  apiId: { type: String, default: "None" },
  date: { type: Date, default: Date.now }
});

MorselSchema.options.toJSON = MorselSchema.options.toJSON || {};
MorselSchema.options.toJSON.transform = (doc, ret) => {
  return ret;
};

const Morsel = mongoose.model('morsel', MorselSchema);

/**
 * @swagger
 * definitions:
 *   Morsel:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         default: objectId
 *       hashtag:
 *         type: string
 *         default: None
 *       service:
 *         type: string
 *         default: local
 *       username:
 *         type: string
 *         default: Anonymous
 *       content:
 *         type: string
 *         default: None
 *       apiId:
 *         type: string
 *         default: None
 *       date:
 *         type: Date
 *         default: now
 */

export default Morsel;
