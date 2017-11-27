var dynamo = require('dynamodb');

import { Morsel, Cron } from '../models';
import log from 'log';
import config from '../config';

const { region, akid, secret } = config.dynamodb;
dynamo.AWS.config.update({
    accessKeyId: akid,
    secretAccessKey: secret,
    region: region
});

const init = () => {
    dynamo.createTables(function(err) {
        if (err) {
            console.log('Error creating tables: ', err);
        } else {
            console.log('Tables has been created');
        }
    });
};

export { init };
