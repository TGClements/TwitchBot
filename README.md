# Badger's Twitch Chat Bot

## Dependencies

- [Node.js](https://nodejs.org/en/)
- [tmi.js](https://tmijs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

If you need to install any of these dependencies, follow the links and the instructions on their pages.

---

## How to run the bot on a local machine

- Create a new twitch account for your bot, if you don't have one already
- Make sure to have node.js installed
- Clone or download the git project
- Create a file called: `.env` in the same folder where bot.js resides
- In the .env file, specify the following:

```
USERNAME=BotUsername
PASSWORD=BotOauthToken
CHANNELS=channel1,channel2
```

_NOTE: If you don't have an OAuth token for your bot, log into your bot's account and in that same browser window, visit [this link](https://twitchapps.com/tmi/)_

- Edit line 11 of bot.js and specify the channel name that you would like your bot to work in
- Open a terminal in the folder where bot.js resides
- Run the following command in your terminal: `node bot.js`

---

# Commands

## !about

- Returns information that I created this bot. **Do not modify this command without permission.**

## !dice / !roll

- Rolls a dice of a specified value, i.e. 6-sided dice.

### Example

```
!dice 20

!roll 20
```

## !badger

- Acts as a counter for how many times the command has been used, with some fun response back from the bot.

## !slots

- Bets meaningless coins on a virtual slot machine of Twitch emotes.
- New users will always start with 500 coins.
- You cannot bet more coins than you posses.
- Your payout scales with how much you bet.
- You can reset your coin balance to 500 at any time with: !slots reset.

### Examples of valid commands

```
!slots 1
!slots 500
!slots reset
```

## !coins

- Returns how many coins you possess.

## !commands

- Returns a list of current commands.
- If you code your own new commands, you have to update this list manually.
