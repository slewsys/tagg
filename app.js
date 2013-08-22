/* app.js: Server for Twitter Aggregator. */ 

/**
 * Global vars.
 */
streamData = [];
streamLengthMax = 10;

/**
 * Module dependencies.
 */
var express           = require('express')
,   http              = require('http')
,   sockio            = require('socket.io')
,   routes            = require('./routes')
,   tweets            = require('./routes/tweets')
,   user              = require('./routes/user')
,   path              = require('path');

var app               = express()
,   server            = http.createServer(app)
,   io                = sockio.listen(server);

var twitterAuth       = require('./models/twitterAuth')
,   credentials       = require('./private/twitter-key.json')
,   authTwitterStream = twitterAuth(credentials)
,   streamFilter      =
        {
            track: 'cnnbrk'
        };

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env'))
{
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/tagg-stream', tweets.tagg);
app.get('/users', user.list);

function serverAck ()
{
    console.log('Express server listening on port: ' + app.get('port'));
}

function addStreamClient (clientSocket)
{
    console.log ('socket ID: ' + clientSocket['id']);
    console.log ('disconnected: ' + clientSocket['disconnected']);

    authTwitterStream.broadcast(streamFilter, clientSocket);
}

server.listen(app.get('port'), serverAck);
io.sockets.on('connection', addStreamClient);


