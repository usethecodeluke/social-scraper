import * as dynamo from 'dynamodb';
import log from 'log';
import config from '../config';

const { region, akid, secret } = config.dynamodb;

const init = () => {
    dynamo.AWS.config.update({
        accessKeyId: akid,
        secretAccessKey: secret,
        region: region
    });
    return new Promise((resolve, reject) => {
        try {
            dynamo.createTables(function(err) {
                if (err) {
                    console.log('Error creating tables: ', err);
                } else {
                    console.log('Tables have been created');
                }
            });
            log.info('Database connected');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

export default { init };
