'use strict';
const PAGE_ACCESS_TOKEN = 'EAAYEcHcR32MBACIlv0wweUcJHnuX3cvKsHTDgBxZApt70dtIC6nZBXzC8chvPEZC781KmgVkVBTzimsHxAlTdhv6ZAhx1L04CHIwj99yhkuBJc5kG3R4Tf301XyjYrm79kiza4kBXZBuw5TKiXUWCacvZB5GmjaZCzoEXv3e9L8QQZDZD';
const START_SEARCH_NO = 'START_SEARCH_NO';
const START_SEARCH_YES = 'START_SEARCH_YES';
const GREETING = 'GREETING';
const JAPAN_YES = 'JAPAN_YES';
const JP_LOC_PROVIDED = 'JP_LOC_PROVIDED';
const SYMPTOMS_PROVIDED = 'SYMPTOMS_PROVIDED';
const PREF_CLEANUP = 'PREF_CLEANUP';
const PREF_REVEGETATION = 'PREF_REVEGETATION';
const PREF_BIO_SURVEY = 'PREF_BIO_SURVEY';
const PREF_CANVASSING = 'PREF_CANVASSING';
const JAPAN_NO = 'JAPAN_NO';
const OTHER_HELP_YES = 'OTHER_HELP_YES';
const GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const MONGODB_URI = process.env.MONGODB_URI;
const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;
const FACEBOOK_SEND_MESSAGE_URL = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN;

const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  mongoose = require('mongoose'),
  app = express().use(body_parser.json()), // creates express http server
  unirest = require('unirest');

//var db = mongoose.connect(MONGODB_URI);
var ChatStatus = require("./models/chatstatus");

// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Return a '200 OK' response to all events
  res.status(200).send('EVENT_RECEIVED');
 
  const body = req.body;


  if (body.object === 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      if (body.entry && body.entry.length <= 0){
        return;
      }
      body.entry.forEach((pageEntry) => {
        // Iterate over each messaging event and handle accordingly
        pageEntry.messaging.forEach((messagingEvent) => {
          console.log({messagingEvent});
          if (messagingEvent.postback) {
            handlePostback(messagingEvent.sender.id, messagingEvent.postback);
          } else if (messagingEvent.message) {
            if (messagingEvent.message.quick_reply){
              handlePostback(messagingEvent.sender.id, messagingEvent.message.quick_reply);
            } else{
              handleMessage(messagingEvent.sender.id, messagingEvent.message);
            }
          } else {
            console.log(
              'Webhook received unknown messagingEvent: ',
              messagingEvent
            );
          }
        });
      });
    }
});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = 'randomstring';

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

/*app.post('/webhook/', function(req, res) {
  console.log(JSON.stringify(req.body));
  if (req.body.object === 'page') {
    if (req.body.entry) {
      req.body.entry.forEach(function(entry) {
        if (entry.messaging) {
          entry.messaging.forEach(function(messagingObject) {
              var senderId = messagingObject.sender.id;
              if (messagingObject.message) {
                if (!messagingObject.message.is_echo) {
                  //Assuming that everything sent to this bot is a movie name.
                  var movieName = messagingObject.message.text;
                  getMovieDetails(senderId, movieName);
                }
              } else if (messagingObject.postback) {
                console.log('Received Postback message from ' + senderId);
              }
          });
        } else {
          console.log('Error: No messaging key found');
        }
      });
    } else {
      console.log('Error: No entry key found');
    }
  } else {
    console.log('Error: Not a page object');
  }
  res.sendStatus(200);
})*/


/* function sendUIMessageToUser(senderId, elementList) {
  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elementList
          }
        }
      }
    }
  }, function(error, response, body) {
        if (error) {
          console.log('Error sending UI message to user: ' + error.toString());
        } else if (response.body.error){
          console.log('Error sending UI message to user: ' + JSON.stringify(response.body.error));
        }
  });
} */


function sendMessageToUser(senderId, message) {

  unirest.post("https://FacebookMessengerdimashirokovV1.p.rapidapi.com/sendTextMessage")
  .header("X-RapidAPI-Key", "88542d2bf5msh158655977701432p1933aajsnae0ab2fea047")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .send(`recipientId=${senderId}`)
  .send(`message=message`)
  .send(`pageAccessToken=${PAGE_ACCESS_TOKEN}`)
  .end(function (result) {
        //console.log(result.status, result.headers, result.body);
    });

  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
        recipient: {
        id: senderId
      },
      message: {
        "text": "Here is a quick reply!",
        "quick_replies":[
      {
        "content_type":"text",
        "title":"Search",
        "payload":"<POSTBACK_PAYLOAD>",
        "image_url":"http://example.com/img/red.png"
      },
      {
        "content_type":"location"
      }
    ]      }
    }
  }, 

  function(error, response, body) {
        if (error) {
          console.log('Error sending message to user: ' + error);
        } else if (response.body.error){
          console.log('Error sending message to user: ' + response.body.error);
        }
  });
}


function handleMessage(sender_psid, message){

    sendMessageToUser(sender_psid, message);

}


/*
 request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: {
              recipient: { id: senderId },
              message: { text }
        }
    })
};*/
