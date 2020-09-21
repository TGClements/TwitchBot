require('dotenv').config();
const tmi = require('tmi.js');
const fs = require('fs');

// Define configuration options
const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: process.env.CHANNELS.split(','),
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
    case '!coins':
      getCoins(target, context);
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
  if (isNaN(amount) && amount != 'reset') {
    client.say(target, `Please specify how many coins to bet. (Ex: !slots 25)`);
    return;
  }

  if (amount == null) {
    client.say(target, `Please specify how many coins to bet. (Ex: !slots 25)`);
    return;
  }

  if (amount <= 0) {
    client.say(target, `Please bet at least 1 coin! (Ex: !slots 25)`);
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
      if (data.users[i].name == context['display-name']) {
        userBank = data.users[i].coins;
        foundUser = true;

        if (amount > data.users[i].coins) {
          client.say(
            target,
            `You cannot bet more coins than you possess! If you are at 0 coins, please use the following command: !slots reset`
          );
          return;
        }

        if (amount == 'reset') {
          data.users[i].coins = 500;
          fs.writeFileSync('data.json', JSON.stringify(data));
          client.say(target, `Your coins are reset to 500.`);
          return;
        }
      }
    }
  }

  // If user does not exist, initialize
  if (!foundUser) {
    console.log(`Need to store user: ${context['display-name']}.`);

    let newUser = {
      name: context['display-name'],
      coins: 500,
    };

    data.users[data.users.length] = newUser;
    fs.writeFileSync('data.json', JSON.stringify(data));
  }

  let emoteOptions = [
    'DatSheffy',
    'BibleThump',
    'FailFish',
    'Kappa',
    'DansGame',
    'DxCat',
    'ResidentSleeper',
    'HeyGuys',
    'PogChamp',
  ];
  let slotPicks = [];

  // Else, proceed with the slots
  for (var i = 0; i < 3; i++) {
    slotPicks[i] = emoteOptions[Math.floor(Math.random() * 8)];
  }

  let didWin = false;
  let winnings = 0;
  let scale = 1;

  if (betAmount > 10) {
    scale = Math.floor(betAmount / 10);
  }

  // Determining Payouts
  if (slotPicks.includes('PogChamp')) {
    let pogCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'PogChamp') pogCount++;
    }

    if (pogCount == 3) {
      didWin = true;
      winnings = 2000 * scale;
    }
  }

  if (!didWin && slotPicks.includes('HeyGuys')) {
    let heyCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'HeyGuys') heyCount++;
    }

    if (heyCount == 3) {
      didWin = true;
      winnings = 200 * scale;
    }
    if (
      (slotPicks[0] == 'HeyGuys' && slotPicks[1] == 'HeyGuys') ||
      (slotPicks[1] == 'HeyGuys' && slotPicks[2] == 'HeyGuys')
    ) {
      didWin = true;
      winnings = 100 * scale;
    }
  }

  if (!didWin && slotPicks.includes('ResidentSleeper')) {
    let rsCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'ResidentSleeper') rsCount++;
    }

    if (rsCount == 3) {
      didWin = true;
      winnings = 100 * scale;
    }
    if (
      (slotPicks[0] == 'ResidentSleeper' &&
        slotPicks[1] == 'ResidentSleeper') ||
      (slotPicks[1] == 'ResidentSleeper' && slotPicks[2] == 'ResidentSleeper')
    ) {
      didWin = true;
      winnings = 50 * scale;
    }
  }

  if (!didWin && slotPicks.includes('DxCat')) {
    let catCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'DxCat') catCount++;
    }

    if (catCount == 3) {
      didWin = true;
      winnings = 50 * scale;
    }
    if (
      (slotPicks[0] == 'DxCat' && slotPicks[1] == 'DxCat') ||
      (slotPicks[1] == 'DxCat' && slotPicks[2] == 'DxCat')
    ) {
      didWin = true;
      winnings = 25 * scale;
    }
  }

  if (!didWin && slotPicks.includes('DansGame')) {
    let dgCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'DansGame') dgCount++;
    }

    if (dgCount == 3) {
      didWin = true;
      winnings = 30 * scale;
    }
    if (dgCount == 2) {
      didWin = true;
      winnings = 20 * scale;
    }
    if (dgCount == 1) {
      didWin = true;
      winnings = 10 * scale;
    }
  }

  if (!didWin && slotPicks.includes('Kappa')) {
    let kappaCount = 0;

    for (var i = 0; i < 3; i++) {
      if (slotPicks[i] == 'Kappa') kappaCount++;
    }

    if (kappaCount == 3) {
      didWin = true;
      winnings = 15 * scale;
    }
    if (kappaCount == 2) {
      didWin = true;
      winnings = 10 * scale;
    }
    if (kappaCount == 1) {
      didWin = true;
      winnings = 5 * scale;
    }
  }

  let updatedUser = {
    name: '',
    coins: 0,
  };

  for (var i = 0; i < data.users.length; i++) {
    if (data.users[i].name == context['display-name']) {
      data.users[i].coins -= betAmount;
      data.users[i].coins += winnings;
      fs.writeFileSync('data.json', JSON.stringify(data));

      if (didWin) {
        client.say(
          target,
          `Slot results | ${slotPicks[0]} | ${slotPicks[1]} | ${slotPicks[2]} | You won ${winnings} coins!`
        );
      } else {
        client.say(
          target,
          `Slot results | ${slotPicks[0]} | ${slotPicks[1]} | ${slotPicks[2]} | You lost ${betAmount} coins!`
        );
      }
    }
  }
}

function getCoins(target, context) {
  let data = fs.readFileSync('data.json');
  data = data.toString();
  data = JSON.parse(data);

  // Check if user is already in data.json
  if (data.users.length > 0) {
    for (var i = 0; i < data.users.length; i++) {
      if (data.users[i].name == context['display-name']) {
        client.say(
          target,
          `@${data.users[i].name}, you have ${data.users[i].coins} coins.`
        );
        return;
      }
    }
  }

  client.say(
    target,
    `@${context['display-name']}, you have not played yet. To play, use the command: !slots`
  );
  return;
}

// DO NOT REMOVE THIS FUNCTION WITHOUT PERMISSION
function about(target) {
  client.say(target, '/me was created by: https://www.twitch.tv/mysticbadger');
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
