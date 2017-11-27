import express from 'express';
import { Morsel, Cron } from '../models';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

var Twitter = require('twitter');

export default async function (hashtag, id = 0) {
    var client = new Twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        bearer_token: BEARER_TOKEN
    });
    client.get('search/tweets', {q: hashtag, count: 100, since_id: id, result_type: 'recent'}, function(error, tweets, response) {
        try {
            tweets.statuses.forEach(function(tweet) {
                Morsel.create({
                    hashtag: hashtag,
                    service: 'twitter',
                    content: tweet.text,
                    apiId: tweet.id_str
                });
            });
        } catch(err) {
            console.log(err);
            return;
        }
        return tweets.search_metadata.max_id_str;
    });
}
