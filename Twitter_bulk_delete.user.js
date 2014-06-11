// ==UserScript==
// @name        Twitter Bulk Delete
// @namespace   Twitter
// @include     https://twitter.com/*
// @version     3.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       none
// ==/UserScript==
 
$(document).ready(function()
{

    var language = window.navigator.userLanguage || window.navigator.language;


    var tbd_translations = {
        'defaults': {
            select_all_weets: "Select All Tweets",            
            deselect_retweets: "Deselect Retweets",
            delete_selected_tweets: "Delete Selected Tweets",
            delete_selected_tweets_q:"Delete selected tweets?",
            delete_this_tweet: "delete this ↓ tweet"
        },
        'ru-ru': {
            select_all_weets: "Выбрать все твиты",            
            deselect_retweets: "Исключить ретвиты",
            delete_selected_tweets: "Удалить выбранные твиты",
            delete_selected_tweets_q:"Точно удалить выбранные твиты?",
            delete_this_tweet: "удалить этот ↓ твит"
        },
        'ru': {
            select_all_weets: "Выбрать все твиты",            
            deselect_retweets: "Исключить ретвиты",
            delete_selected_tweets: "Удалить выбранные твиты",
            delete_selected_tweets_q:"Точно удалить выбранные твиты?",
            delete_this_tweet: "удалить этот ↓ твит"
        }        
    };

    var tbd_l = tbd_translations[language.toLowerCase()]
              ? tbd_translations[language.toLowerCase()] 
              : tbd_translations.defaults;

    setInterval(function(){

        $('.js-stream-item').each(function() {
             
             if ($(this).find('.ProfileCard').length) return;
                 
            if (!$(this).find('.ch_del_tweets').length)
            {
                var tweet_id = $(this).find('.js-stream-tweet').attr('data-tweet-id');
                var tweet_type = $(this).find('.js-stream-tweet a.undo-retweet:visible').length>0 ? 'retweet' : 'tweet';
                var html ='';
                html += '<div style="width:auto; border-radius:5px 5px 0px 0px; padding:2px 5px; font-size:12px; background-color:black; color:white; overflow:hidden;">';
                html += '<div style="float:left;">';
                html += '<input type="checkbox" tweet_id="'+tweet_id+'" tweet_type="'+tweet_type+'" class="ch_del_tweets"/> ';
                html += '</div>';
                html += '<div style="float:left; margin-top:2px; margin-left:5px;">';
                html += tbd_l.delete_this_tweet;
                html += '</div>';
                html += '</div>';
                $(this).prepend(html);
            }
 
        });
        
        if ( ! $('#tbd-manage-panel').is(':visible') )
        {
                var html ='';
                html +='<div id="tbd-manage-panel" style="background-color:white; border: 1px solid #E1E8ED; border-radius:6px; margin:10px 0;padding:5px; overflow:hidden;">';
                html +='<input type="button" value="'+tbd_l.delete_selected_tweets+'" id="func_del_tweets" style="float:right; border:1px solid #990000; background-color:#990000; background-image: -moz-linear-gradient(#E60000, #990000); color:white; margin-left:5px;" />';
                html +='<input type="button" value="'+tbd_l.deselect_retweets+'" id="func_deselect_retweets" style="float:right; border:1px solid #405D2D; margin-left:5px; background-color:#6B9B4A; color:#9DFF6A; background-image: -moz-linear-gradient(#6B9B4A, #405D2D);" />';   
                html +='<input type="button" value="'+tbd_l.select_all_weets+'" id="func_select_all_tweets" style="float:right; margin-left:5px; background-color:#DDD; background-image: -moz-linear-gradient(#FFFFFF, #DDDDDD);" />';
                html +='</div>';
             
                $(html).insertBefore('.ProfileHeading');
        }
        
        var click_event_obj = $('#func_select_all_tweets');
        if (click_event_obj.length>0 && (!click_event_obj.data('events') || !click_event_obj.data('events').click))
        {
                click_event_obj.click(function(){
                    $('input.ch_del_tweets').attr('checked','checked');
                });
        }
        
        var click_event_obj = $('#func_deselect_retweets');
        if (click_event_obj.length>0 && (!click_event_obj.data('events') || !click_event_obj.data('events').click))
        {
                click_event_obj.click(function(){
                    $('.retweeted:visible').each(function(){
                        $(this).parent().find('.ch_del_tweets').attr('checked','');
                    });
                });
        }

        var click_event_obj = $('#func_del_tweets');
        if (click_event_obj.length>0 && (!click_event_obj.data('events') || !click_event_obj.data('events').click))
        {
                click_event_obj.click(function(){
                    if (!confirm(tbd_l.delete_selected_tweets_q)) return false;
             
                    var tweet_authenticity_token = $('input.authenticity_token').val();
             
                    $('input.ch_del_tweets:checked').each(function(){
                        var action_url = 'https://twitter.com/i/tweet/destroy';
                        if ($(this).attr('tweet_type')=='retweet')
                        {
                            action_url = 'https://twitter.com/i/tweet/unretweet';
                        }

                        var tweet_id = $(this).attr('tweet_id');
                        $.ajax({
                          type: 'POST',
                          url: action_url,
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
        }
 
    }, 250);
 
});