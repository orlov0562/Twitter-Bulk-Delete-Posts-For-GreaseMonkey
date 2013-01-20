// ==UserScript==
// @name        Twitter bulk delete
// @namespace   twitter
// @include     https://twitter.com/*
// @version     1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// ==/UserScript==

$(document).ready(function()
{

    var html ='';
    html +='<div style="margin-bottom: 10px;width:510px; border-radius:0px 0px 5px 5px; background-color:black; padding:5px; overflow:hidden;">';
    html +='<input type="button" value="Delete Selected Tweets" id="func_del_tweets" style="float:right; border:1px solid #990000; background-color:#990000; background-image: -moz-linear-gradient(#E60000, #990000); color:white; margin-left:5px;" />';
    html +='<input type="button" value="Select All Tweets" id="func_select_all_tweets" style="float:right; margin-left:5px; background-color:#DDD; background-image: -moz-linear-gradient(#FFFFFF, #DDDDDD);" />';
    html +='</div>';

    $('.content-header').append(html);

    $('#func_select_all_tweets').click(function(){
        $('input.ch_del_tweets').attr('checked','checked');
    });

    $('#func_del_tweets').click(function(){
        if (!confirm('Delete selected tweets?')) return false;

        var tweet_authenticity_token = $('input.authenticity_token').val();

        $('input.ch_del_tweets:checked').each(function(){
            var tweet_id = $(this).attr('tweet_id');
            $.ajax({
              type: 'POST',
              url: 'https://twitter.com/i/tweet/destroy',
              data: {
                      _method:'DELETE',
                      authenticity_token: tweet_authenticity_token,
                      id: tweet_id
              },
              success: function(){
                  $('#stream-item-tweet-'+tweet_id).slideUp('fast', function(){
                      $('#stream-item-tweet-'+tweet_id).html('')
                  });

              },
            });

        });

    });

    setInterval(function(){

        $('.js-stream-item').each(function() {

            if (!$(this).find('.ch_del_tweets').length)
            {
                var tweet_id = $(this).find('.js-stream-tweet').attr('data-tweet-id');
                var html ='';
                html += '<div style="width:510px; border-radius:5px 5px 0px 0px; padding:2px 5px; font-size:12px; background-color:black; color:white; overflow:hidden;">';
                html += '<div style="float:left;">';
                html += '<input type="checkbox" tweet_id="'+tweet_id+'" class="ch_del_tweets"/> ';
                html += '</div>';
                html += '<div style="float:left; margin-top:2px; margin-left:5px;">';
                html += 'delete this &darr; tweet';
                html += '</div>';
                html += '</div>';
                $(this).prepend(html);
            }

        });

    }, 250);

});