
/*
 * GET tagg-stream.
 */

function taggStream (req, res)
{
    res.render('tagg-stream',
               {
                   title           : 'Responsive Twitter Aggregator',
                   subtitle        : 'Twitter Streaming API via Socket.IO',
                   streamLengthMax : streamLengthMax,
                   streamData      : streamData ?  streamData : []
               }
              );
};

exports.stream = taggStream;
