const express = require('express');
var request = require('request'); // "Request" library
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require("ejs")
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
clientId: 'c156d26ad29248d096343f368b17eebc', // Your client id
clientSecret: 'f15093077da945368c2bd20ddc5f37ba', // Your secret
redirectUri: 'http://localhost:5000/callback' // Your redirect uri
});

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

app.post('/search', (req, res) => {
    console.log(req.body)
    var firstSong = {}
    spotifyApi.clientCredentialsGrant().then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    
        return spotifyApi.searchPlaylists(req.body.word)
        .then(
          function(data) {
            console.log('found playlists are', data.body);
            firstSong = data.body.playlists.items[0]
            console.log(firstSong)
          },
          function(err) {
            console.error(err);
          }
        );
    }).catch(function(err) {
        console.log('unfortunately, something went wrong', err.message);
    })
})

app.use('/api', tweetRouter)



app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
