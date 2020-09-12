# Badger's Twitch Chat Bot

## Dependencies

- [Node.js](https://nodejs.org/en/)
- [tmi.js](https://tmijs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

If you need to install any of these dependencies, follow the links and the instructions on their pages.

---

## How to run the bot on a local machine

- Make sure to have node.js installed
- Clone or download the git project
- Create a file called: `.env` in the same folder where bot.js resides
- In the .env file, specify the following:

```
USERNAME=BotUsername
PASSWORD=BotOauthToken
```

_NOTE: If you don't have an OAuth token for your bot, log into your bot's account and in that same browser window, visit [this link](https://twitchapps.com/tmi/)_

- Edit line 10 of bot.js and specify the channel name that you would like your bot to work in
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
