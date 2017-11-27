import express from 'express';
import { Morsel, Cron } from '../models';

const env = process.env.NODE_ENV;
var Twitter = require('twitter');

export default async function (hashtag, id) {
    var client = new Twitter({
        consumer_key: env.CONSUMER_KEY,
        consumer_secret: env.CONSUMER_SECRET,
        bearer_token: env.BEARER_TOKEN
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
