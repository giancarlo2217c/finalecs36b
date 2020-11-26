const tweetModel = require('../models/tweetModel')
var Twit = require('twit');

var T = new Twit({
    consumer_key: 'G89gxYq2RnULHvdw2vW1rENsx',
    consumer_secret: 'MiO3xFLVkiFyZFwkjc0UbkPo122JTLqK6yxowKz9GszsBvbrTn',
    access_token: '1091434355421982721-pz7qT3CvGhaj81DPOUdy5SCQXDM56k',
    access_token_secret: 'BVOp6cyKYJ33D8enffUCFQVgPkJASdRvrmcTUCk0j0kWk',
    timeout_ms: 60*1000,
    strictSSL: true,
})

const createTweet = async (req, res) => {

    var tweet = req.body.tweet;
    promise = new Promise( (resolve, reject) => { 
        T.get('search/tweets', { q: tweet, count: 100}, function(err, data, response) {
            resolve(data.statuses); 
        })
    })

    let tweetData = await promise; //tweet data is an array of tweets; its length is specified by count at T.get
    
    const body = tweetData;
    
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a tweet',
        })
    }

    tweetData.forEach( (tweet, index) => {

        console.log(tweetData[index].text)

        const simpleTweet = {
            _id: tweet.id,
            time: tweet.created_at, 
            name: tweet.user.name,
            description: tweet.user.description,
            text: tweet.text
        }

        const newTweet = new tweetModel(simpleTweet)

        if (!simpleTweet) {
            return res.status(400).json({ success: false, error: err })
        }

        newTweet
            .save()
            .then(() => {
                console.log('tweet created!')
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'tweet not created!',
                })
            })
    });

    res.redirect('/')
}

const updateTweet = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    tweetModel.findOne({ _id: req.params.id }, (err, tweet) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'tweet not found!',
            })
        }
        tweet.title = body.title
        tweet.content = body.content
        
        tweet
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: tweet._id,
                    message: 'tweet updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'tweet not updated!',
                })
            })
    })
}

const deleteTweet = async (req, res) => {
    await tweetModel.findOneAndDelete({ _id: req.params.id }, (err, tweet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!tweet) {
            return res
                .status(404)
                .json({ success: false, error: `tweet not found` })
        }

        return res.status(200).json({ success: true, data: tweet })
    }).catch(err => console.log(err))
}

const getTweetById = async (req, res) => {
    await tweetModel.findOne({ _id: req.params.id }, (err, tweet) => { //dynamic requests? forgot the name... Users enters a URL
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!tweet) {
            return res
                .status(404)
                .json({ success: false, error: `tweet not found` })
        }
        return res.status(200).json({ success: true, data: tweet })
    }).catch(err => console.log(err))
}

const getTweets = async (req, res) => {
    await tweetModel.find({}, (err, Tweets) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!Tweets.length) {
            return res
                .status(404)
                .json({ success: false, error: `Tweets not found` })
        }
        return res.status(200).json({ success: true, data: Tweets })
    }).catch(err => console.log(err))
}

module.exports = {
    createTweet,
    updateTweet,
    deleteTweet,
    getTweets,
    getTweetById,
}

