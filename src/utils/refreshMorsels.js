import express from 'express';
import { Morsel, Cron } from '../models';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

var Twitter = require('twitter');

export default async function (hashtag, id) {
    var client = new Twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        bearer_token: BEARER_TOKEN
    });
    client.get('search/tweets', {q: hashtag, count: 100, since_id: id, result_type: 'recent'}, function(error, tweets, response) {
        try {
            tweets.statuses.forEach(function(tweet) {
                try {
                    let morsel = new Morsel();
                    morsel.hashtag = hashtag;
                    morsel.service = 'twitter';
                    morsel.content = tweet.text;
                    morsel.apiId = tweet.id_str;
                    morsel.save();
                } catch (err) {
                    console.log(err);
                    return;
                }
            });
            Cron.findOneAndUpdate({'hashtag': hashtag}, {'last_id': tweets.search_metadata.max_id_str}, {new:true, upsert:true}, function() {
                console.log('refresh complete! new id: ' + tweets.search_metadata.max_id_str);
            });
        } catch(err) {
            console.log("Connection Failure");
            return;
        }
    });
}
