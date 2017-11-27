import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const CronSchema = new Schema({
  hashtag: { type: String, default: "None" },
  last_id: { type: String, default: "0"},
  date: { type: Date, default: Date.now }
});

CronSchema.options.toJSON = CronSchema.options.toJSON || {};
CronSchema.options.toJSON.transform = (doc, ret) => {
  return ret;
};

const Cron = mongoose.model('cron', CronSchema);
export default Cron;
