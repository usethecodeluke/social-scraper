import express from 'express';
import { Morsel, Cron } from '../models';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

var Twitter = require('twitter');

export default async function (hashtag, cron) {
    var cron = cron || {lastId:0};
    var tweet_list = [];
    var client = new Twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        bearer_token: BEARER_TOKEN
    });
    const tweets = await client.get('search/tweets', {q: hashtag, count: 100, since_id: cron.lastId, result_type: 'recent'});
    tweets.statuses.forEach(function(tweet) {
        tweet_list.push({
            hashtag: hashtag,
            service: 'twitter',
            content: tweet.text,
            apiId: tweet.id_str
        });
    });
    Morsel.create(tweet_list);
    return new Promise(resolve => {
        resolve(tweets.search_metadata.max_id_str);
    });
 }
