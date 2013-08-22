
/*
 * GET home page.
 */

exports.index = function(req, res)
{
  res.render('index',
             {
                 title: 'Twitter Aggregator',
                 handles: [ '@cnnbrk' ]
             }
            );
};
