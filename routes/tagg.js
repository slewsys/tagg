
/*
 * GET tagg-stream.
 */

function taggStream (req, res)
{
    res.render('tagg-stream',
               {
                   title           : 'Twitter Aggregator',
                   subtitle        : 'Twitter Streaming API via Socket.IO',
                   streamLengthMax : streamLengthMax,
                   streamData      : streamData ?  streamData : []
               }
              );
};

exports.stream = taggStream;
