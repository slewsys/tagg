/*
 * client.js: Connect to push server, appending tweets
 * to end of list and removing top-most when total exceeds a maximum.
 */
$(function()
  {
      // Establish socket.io connection with server.
      var serverSocket = io.connect(document.location.origin);

      function tweetHandler (data)
      {
          var tweet = '\n' + data.text + '\n';

          // console.log(data);
          
          // If more than streamLengthMax elements, remove first.
          if ($('.tweet').size() >= 10)
              $('.tweet').first().remove();

          // Append new element to end.
          $('<div class="tweet">' + tweet + '</div>').appendTo('.container');

          $('p#last-modified').text('Updated ' + new Date().toString());
      };

      serverSocket.on('solo', tweetHandler);

      console.log('Receiving from: ' +  document.location.origin);
  });
