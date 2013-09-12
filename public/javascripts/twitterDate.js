$(function ()
  {
      function twitterDate (dateString)
      {
          // Time constants.
          var MinuteOfSeconds = 60;
          var HourOfSeconds = 60 * MinuteOfSeconds;
          var DayOfSeconds = 24 * HourOfSeconds;

          
          var currentTime;
          var givenTime;
          var secondsAgo;
          var minutesAgo;
          var hoursAgo;
          var daysAgo;

          try
          {
              currentTime = new Date ();
              givenTime = new Date (dateString);
              secondsAgo = Math.round ((currentTime - givenTime) / 1000);

              if (secondsAgo < 1)
                  dateString = 'now';
              else if (secondsAgo < 2)
                  dateString = '1 second ago';
              else if (secondsAgo < MinuteOfSeconds)
                  dateString = secondsAgo + ' seconds ago';
              else if (secondsAgo < 1.5 * MinuteOfSeconds) 
                  dateString = 'about a minute ago'; 
              else if (secondsAgo < HourOfSeconds)
              {
                  minutesAgo = Math.round (secondsAgo / MinuteOfSeconds);
                  dateString = minutesAgo + ' minutes ago'; 
              }
              else if (secondsAgo < (60 * 90)) 
                  dateString = 'about an hour ago'; 
              else if (secondsAgo < (60 * 60 * 24)) 
              {
                  hoursAgo = Math.round (secondsAgo / HourOfSeconds);
                  dateString = hoursAgo + ' hours ago'; 
              }
              else if (secondsAgo <  (60 * 60 * 36)) 
                  dateString = 'about a day ago'; 
              else 
              {
                  daysAgo = Math.round (secondsAgo / DayOfSeconds);
                  dateString = daysAgo + ' days ago'; 
              }
          }
          catch (error)
          {
              console.log ('twitterDate: ' + dateString + ': Parse error');
          }

          return dateString;
      }

      /* Display time in Twitter format. */
      $('.dt-updated').each (
          function (index)
          {
              console.log ($(this).attr ('datetime'));
              $(this).html (twitterDate ($(this).attr ('datetime')));
          }
      );                                 
  }
 );
