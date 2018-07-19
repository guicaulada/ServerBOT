const config = {
  bot: require('./bot.js'),
  services: require('./services.js'),
  updateInterval: 300000,
  dns: process.env.SERVERBOT_DNS,
};

module.exports = config;
