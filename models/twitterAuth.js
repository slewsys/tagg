/*
 * twitterAuth.js: Twitter stream authentication module.
 * 
 * twitterAuth:
 *     Given Twitter credentials, authenticates stream request;
 *     returns object with broadcast() property.
 *
 * twitterAuth.broadcast:
 *     Given stream filter options and client socket, relays twitter stream
 *     to client.
 */

var nt                = require('ntwitter');

var clientList = [];
var haveTwitterStream = false;
var lastBroadcastTime = new Date ();

function tweetClient (tweet, id)
{
    clientList[id].emit('solo', tweet);
}

function broadcastTweet (tweet)
{
    var clients = 0;
    var currentTime = new Date ();
    var broadcastDelay = 0;

    // Ignore corrupted tweets.
    if (tweet.text === undefined)
        return;
    
    // Ignore if text in streamData[].
    for (i = 0; i < streamData.length; ++i)
    {
        if (tweet.text === streamData[i].text)
            return;
    }

    // Push unique tweet onto global streamData[].
    if (streamData.length >= streamLengthMax)
    {
        streamData.shift();
    }
    streamData.push(tweet);

    // Throttle transmission to 1 second per tweet (per client).
    if (currentTime - lastBroadcastTime < 1000)
        {
            // Increment lastBroadcastTime by 1 second.
            lastBroadcastTime.setSeconds(lastBroadcastTime.getSeconds() + 1);
            broadcastDelay = lastBroadcastTime - currentTime;
        }
    else
        lastBroadcastTime = currentTime;

    // Broadcast to clientList.
    for (var id in clientList)
    {
        if (clientList[id]['disconnected'])
            delete clientList[id];
        else
        {
            setTimeout (tweetClient, broadcastDelay, tweet, id);
            ++clients;
        }
    }

    console.log('New tweet: ' + tweet.text);
    console.log ('Broadcast delay: ' + broadcastDelay);
    console.log ("Active clients: " + clients);
};

function streamHandler (twitterSocket)
{
    twitterSocket.on('data', broadcastTweet);
};

function broadcast (options, clientSocket)
{
    var clientID = clientSocket['id'];

    // Add clientSocket to global clientList.
    clientList[clientID] = clientSocket;

    // Start Twitter stream if clientSocket only client.
    if (!haveTwitterStream)
    {
        haveTwitterStream = true;
        this.stream('statuses/filter', options, streamHandler);
    }

    console.log ("haveTwitterStream: " + haveTwitterStream);
};

function twitterAuth (credentials)
{
    var t = new nt(credentials);

    t.broadcast = broadcast;
   return t;
};

module.exports = twitterAuth;
