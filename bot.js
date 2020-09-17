require('dotenv').config();
const tmi = require('tmi.js');
const fs = require('fs');

// Define configuration options
const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: ['mysticbadger'],
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self || !msg.startsWith('!')) {
    return;
  } // Ignore messages from the bot

  const command = msg.split(' ');

  switch (command[0]) {
    case '!roll':
    case '!dice':
      rollDice(target, command[1]);
      console.log(`* Executed ${command[0]} command`);
      break;
    case '!badger':
      badger(target);
      console.log(`* Executed ${command[0]} command`);
      break;
    case '!slots':
      slots(target, command[1], context);
      console.log(`* Executed ${command[0]} command`);
      break;
    case '!about':
      about(target);
      console.log(`* Executed ${command[0]} command`);
      break;
    default:
      console.log(`* Command ${command[0]} not found`);
      break;
  }
}

// Function called when the "dice" command is issued
function rollDice(target, arg2) {
  const sides = Number(arg2);

  if (arg2 == null) {
    client.say(
      target,
      `Please specify how many sides the dice has. (Ex: !dice 6)`
    );
    return;
  }

  if (Number.isInteger(sides)) {
    const result = Math.floor(Math.random() * sides) + 1;

    client.say(target, `You rolled a ${result} on a ${sides}-sided dice!`);
  } else {
    client.say(
      target,
      `Invalid command argument. (Example valid command: !dice 6)`
    );
  }
}

function badger(target) {
  // read values from file, store, increment, then write back

  let data = fs.readFileSync('data.json');
  data = data.toString();
  data = JSON.parse(data);

  data.generalData[0].badger += 1;

  fs.writeFileSync('data.json', JSON.stringify(data));

  client.say(
    target,
    `The badger has been summoned ${data.generalData[0].badger} times BadgerFace`
  ); // NOTE: BadgerFace is a frankerfacez emote added to the channel
}

function slots(target, amount, context) {
  if (amount == null) {
    client.say(target, `Please specify an amount. (Ex: !slots 25)`);
    return;
  }

  let betAmount = Number(amount);
  var userBank = 0;
  var foundUser = false;

  let data = fs.readFileSync('data.json');
  data = data.toString();
  data = JSON.parse(data);

  // Check if user is already in data.json
  if (data.users.length > 0) {
    for (var i = 0; i < data.users.length; i++) {
      // console.log(data.users.length);

      if (data.users[i].name == context['display-name']) {
        // console.log(
        //   `\t${context['display-name']} invoked the command. They want to bet ${betAmount}.`
        // );
        userBank = data.users[i].coins;
        foundUser = true;
      }
    }
  }

  console.log(userBank);

  // If user does not exist, initialize
  if (!foundUser) {
    console.log('Need to store the user.');
  }

  // Else, proceed with the slots
}

// DO NOT REMOVE THIS FUNCTION WITHOUT PERMISSION
function about(target) {
  client.say(target, '/me was created by: https://www.twitch.tv/mysticbadger');
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
