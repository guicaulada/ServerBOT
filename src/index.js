const config = require('./config/config.js');
__spawn = require('cross-spawn');
__Eris = require('eris');

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
__ServerBOT.isWin = process.platform === 'win32';

__ServerBOT.on('ready', () => { // When the bot is ready
  console.log('Ready!'); // Log 'Ready!'
});

require('./commands/index.js');
require('./messages/index.js');
require('./modules/index.js');

require('public-ip').v4().then((ip) => {
  __ServerBOT.config.ip = ip;
});

__ServerBOT.connect(); // Get the bot to connect to Discord
