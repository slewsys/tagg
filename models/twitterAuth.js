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

var oauth                = require ('oauth'),
    util                 = require ('util'),
    through              = require ('through');

// Module vars
var clientList = [],
    haveTwitterStream = false,
    lastBroadcastTime = new Date (),
    twitterAPI =
    {
	       requestTokenURI : 'https://api.twitter.com/oauth/request_token',
        accessTokenURI  : 'https://api.twitter.com/oauth/access_token',
        streamURI       : 'https://stream.twitter.com/1.1',
        userStreamURI   : 'https://userstream.twitter.com/1.1',
        siteStreamURI   : 'https://sitestream.twitter.com/1.1',
        streamParams    :
        [
            'delimited',
            'filter_level',
            'follow',
            'language',
            'locations',
            'stall_warnings',
            'track',
        ]
    };

function tweetClient (tweet, id)
{
    if (clientList[id]['disconnected'])
        delete clientList[id];
    else
        clientList[id].emit('solo', tweet);
}

function broadcastTweet (data)
{
    var clients = 0;
    var currentTime = new Date ();
    var broadcastDelay;
    var tweet;
    
    // Filter '\r\n' from stream.
    if (data.length == 2)
    {
        console.log ("Data: CRNL");
        return;
    }

    // Ignore if unable to convert to JS object.
    try
    {
        tweet = JSON.parse (data);
    }
    catch (error)
    {
        console.log ("JSON parse error: " + error);
        console.log ("data: " + util.inspect (data));
        return;
    }
    
    // Ignore if not a tweet.
    if (tweet.text === undefined)
        return;

    // Ignore if text in streamData[].
    for (var i = 0; i < streamData.length; ++i)
        if (tweet.text === streamData[i].text)
            return;

    // Push unique tweet onto global streamData[].
    if (streamData.length >= streamLengthMax)
        streamData.shift();
    streamData.push(tweet);

    // Throttle transmission to 1 second per tweet (per client).
    if (currentTime - lastBroadcastTime < 1000)
        lastBroadcastTime.setSeconds(lastBroadcastTime.getSeconds() + 1);
    else
        lastBroadcastTime = currentTime;
    broadcastDelay = lastBroadcastTime - currentTime;

    // Broadcast to clientList.
    for (var id in clientList)
    {
        setTimeout (tweetClient, broadcastDelay, tweet, id);
        ++clients;
    }

    console.log ('Broadcast delay: ' + broadcastDelay);
    console.log ("Active clients: " + clients);
};

function streamRelay (response)
{
    response.pipe (through (broadcastTweet));
}

function broadcast (streamParams, clientSocket)
{
    var clientID = clientSocket['id'];

    // Add clientSocket to global clientList.
    clientList[clientID] = clientSocket;

    if (!haveTwitterStream)
    {
        var streamQueryURI = twitterAPI.streamURI + '/statuses/filter.json';

        // Broadcast Twitter stream
        this.oauth.post (streamQueryURI,
                         this.oauthToken.accessTokenKey,
                         this.oauthToken.accessTokenSecret,
                         streamParams,
                         null
                        )
            .on ('response', streamRelay);
    }

    console.log ("haveTwitterStream: " + haveTwitterStream);
};


function twitterAuth (credentials)
{
    if (!(credentials.consumerKey
          || credentials.consumerSecret
          || credentials.accessTokenKey
          || credentials.accessTokenSecret))
        throw new Error ('Access credentials missing or incomplete');

    var oauthConfig =
        {
            'version'    : '1.0',
            'callback'   : null,
            'signature'  : 'HMAC-SHA1',
            'nonceSize'  : 32,
            'headers'    :
            {
                'Accept'     : '*/*',
                'Connection' : 'close',
                'User-Agent' : 'tagg client authentication'
            }
        };

    var clientAuth = new oauth.OAuth(
	       twitterAPI.requestTokenUrl,
	       twitterAPI.accessTokenUrl,
	       credentials.consumerKey,
	       credentials.consumerSecret,
	       oauthConfig.version,
	       oauthConfig.callback,
	       oauthConfig.signature,
        oauthConfig.nonceSize,
        oauthConfig.headers
    );

    var twitterClient =
        {
            'broadcast'     : broadcast,
            'oauth'         : clientAuth,
            'oauthToken'    :
            {
                'accessTokenKey'    : credentials.accessTokenKey,
                'accessTokenSecret' : credentials.accessTokenSecret
            }
        };

    return twitterClient;
};

module.exports = twitterAuth;
