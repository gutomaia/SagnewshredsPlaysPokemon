"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const PORT = 53474;
const HOST = '127.0.0.1';
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const app = express();
const gameboyButtons = ['a', 'b', 'left', 'right', 'up', 'down', 'start', 'select'];

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello Thanks for joining my stream!');
});

app.post('/sms', (req, res) => {
  let message = req.body.Body;
  let twiml = new twilio.TwimlResponse();

  if(gameboyButtons.indexOf(message.toLowerCase()) > -1) {
    twiml.message('Thanks for playing Pokemon with me :)');
    client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
        if (err) console.log(err);
        console.log('UDP message sent to ' + HOST +':'+ PORT);
    });
  } else {
    twiml.message('Please send a valid Gameboy button.');
  }

  res.send(twiml.toString());
});

app.post('/voice', (req, res) => {
  console.log(req.body.Body);

  let twiml = new twilio.TwimlResponse();
  twiml.play('http://demo.brooklynhacker.com/music/classic.mp3');

  res.send(twiml.toString());
});

app.listen(3000, console.log('Listening on port 3000'));
