const bot = {
  token: process.env.SERVERBOT_TOKEN,
  description: 'A Discord bot that starts, stops and show the status of any configured service',
  owner: 'Sighmir#1621',
  prefix: ['!', '@mention '],
};

module.exports = bot;
