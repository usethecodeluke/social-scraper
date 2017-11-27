const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;
const AWS_REGION = process.env.AWS_REGION;

const common = {
  port: 8080
};
const dynamodb = {
    region: AWS_REGION,
    akid: AWS_KEY,
    secret: AWS_SECRET
};

export default Object.assign(common, dynamodb);
