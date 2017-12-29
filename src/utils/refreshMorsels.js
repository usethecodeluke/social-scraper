import express from 'express';
import { Morsel } from '../models';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

var Twitter = require('twitter');

export default async function self (hashtag, lastId) {
    var lastId = lastId || 1;
    var tweet_list = [];
    var morsel_ids = [];
    await Morsel.query(hashtag).exec(function(err, morsels){
        if (err) {
            return;
        }
        morsels.Items.forEach(function(morsel){
            morsel_ids.push(morsel.get('apiId'));
        });
    });
    var client = new Twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        bearer_token: BEARER_TOKEN
    });
    const tweets = await client.get('search/tweets', {q: hashtag, count: 100, since_id: lastId, result_type: 'recent'});
    tweets.statuses.forEach(function(tweet) {
        if (tweet.id_str > lastId) {
            lastId = tweet.id_str;
        }
        if ((tweet.retweeted_status) && (morsel_ids.includes(tweet.retweeted_status.id_str))) {
            return;
        }
        if (tweet.retweeted_status) {
            morsel_ids.push(tweet.retweeted_status.id_str);
        }
        morsel_ids.push(tweet.id_str);
        tweet_list.push({
            hashtag: hashtag,
            service: 'twitter',
            content: tweet.text,
            apiId: tweet.id_str
        });
    });
    console.log('added ', tweet_list.length, ' of ', tweets.statuses.length, ' tweets');
    Morsel.create(tweet_list);
    if (tweets.statuses.length == 100) {
        self(hashtag, lastId);
    }
    return new Promise(resolve => {
        resolve(tweets.search_metadata.max_id_str);
    });
 }
