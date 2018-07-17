__spawn = require('cross-spawn');
__Eris = require('eris');
const config = require('./config/config.js');

if (!config.bot.token) {
  console.log('Environment variable SERVERBOT_TOKEN is undefined!');
  process.exit();
}

// Replace BOT_TOKEN with your bot account's token
__ServerBOT = new __Eris.CommandClient(config.bot.token, {}, {
  description: config.bot.description,
  owner: config.bot.owner,
  prefix: config.bot.prefix,
});

__ServerBOT.config = config;

__ServerBOT.on('ready', () => { // When the bot is ready
  console.log('Ready!'); // Log 'Ready!'
});

require('./commands/index.js');
require('./messages/index.js');
require('./modules/index.js');

__ServerBOT.connect(); // Get the bot to connect to Discord
