Responsive Twitter Aggregator
=============================

Express/Node app displays Twitter stream with "repsonsive" styling.
Twitter 1.1 API and OAuth 1.0 stream request is piped to clients via
Node's Stream API and Socket.io library.

Client Access
-------------

Client access is via URI: *localhost.com:8000/tagg-stream*. Status
updates cover as many columns as supported by client device per
CSS3 media queries.

![alt Responsive Twitter Aggregator Display](public/images/tagg_display.png)

Server Installation
-------------------

Install *tagg* source via the command line:

    git clone http://github.com/slewsys/tagg.git

Fetch dependencies with *npm*:

    cd tagg; npm install -g

Create key file, *private/twitter-key.json*, from template
*private/twitter-key.json.ex* by replacing the keys/secrets provided
by Twitter.com for your app (see:
[Twitter App Manager](https://dev.twitter.com/apps)):

    {
        "consumerKey": "pFIQnX9UfxHRYrsWD8HhzU",
        "consumerSecret": "Mu0oXHMLUyLtA9ACLyReR63tWgsVmhvZXohMulvDfk",
        "accessTokenKey": "158728877-7h9ubC6Q1jX9j02qjCReU1Ca2cb17d8to8fyZa9D",
        "accessTokenSecret": "0mfu6pNJ3QEqnj3Tf11qbnACJY3U9uXPdfXPYEgjFT"
    }

Finally, update script, *start-server*, with paths appropriate to your
system, and run it:

    ./start-server
