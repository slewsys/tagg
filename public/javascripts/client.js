/*
 * client.js: Connect to push server, append tweets
 * and remove top-most to maintain fixed number (streamLengthMax).
 */
$(function()
  {
      // Establish socket.io connection with server.
      var serverSocket = io.connect(document.location.origin);

      function tweetHandler (tweetURI)
      {
          // console.log(tweetURI);
          var html = '<div class="tweet">';
          html += '<iframe class="frame" src="' + tweetURI + '">';
          html += '</frame></div>';
          
          // If more than streamLengthMax elements, remove first.
          if ($('.tweet').size() >= 10)
              $('.tweet').first().remove();

          // Append new iframe to end.
          $(html).appendTo('.container');

          $('p#last-modified').text('Updated ' + new Date().toString());
      };

      serverSocket.on('solo', tweetHandler);

      console.log('Receiving from: ' +  document.location.origin);
  }
 );
