const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require("ejs")

// DATABASE CODE
const db = require('./db/index')
const tweetRouter = require('./routes/tweet-router')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
const Tweet = require('./models/tweetModel')

const app = express()
const apiPort = 5000;

//change view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}) )
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    var tweetsArr = [];

    Tweet.find((err, tweets) => {
        if(err) {
            console.log("there was an error while fetching the tweets")
        } else {
            tweets.forEach( (tweet) => {
                console.log("tweet: " + tweet.name);
                tweetsArr.push(tweet)
            });
            console.log(tweetsArr)
            res.render("index", {
                tweets: tweetsArr
            });
        }
    });

})

app.use('/api', tweetRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
