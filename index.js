var Twitter = require('twitter');
var twitterKeys = {
  "consumer_key": process.env.TWITTER_CONSUMER_KEY,
  "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
  "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
};
var client = new Twitter(twitterKeys);

var fs = require('fs');

client.stream('statuses/filter', JSON.parse(fs.readFileSync('./streamValues.json')), function(stream) {
	stream.on('data', function(tweet) {
		var tweet_id = tweet.id_str;
		var retweet = tweet.retweeted_status || null;
		if(retweet === null)
		{
			client.post('statuses/retweet/' + tweet_id, function(error, tweet, response) {
				if (!error) {
					console.log(tweet.text);
				}
			});
		}
	});
 
  stream.on('error', function(error) {
    console.log(error);
  });
});