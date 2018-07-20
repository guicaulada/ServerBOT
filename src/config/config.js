const config = {
  bot: require('./bot.js'),
  services: require('./services.js'),
  updateInterval: 300000,
  dns: process.env.SERVERBOT_DNS,
  adminRoles: ['405546509770162177', '155180032405274624', '382410412504776705'],
  channel: '369609469543579658',
};

module.exports = config;
