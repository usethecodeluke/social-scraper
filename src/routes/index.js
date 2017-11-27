import express from 'express';
import morsel from './morsel';
import { log } from '../log';
import { swagDocHandler } from '../utils';

const router = new express.Router();

router.get('/', async (req, res) => {
  res.send({ msg: 'HELLO WORLD' });
});

// return swagger doc json data.
router.get('/swagger.json', swagDocHandler);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

// example morsel routes providing: [create|get] methods.
router.use('/morsel', morsel);

export default router;
