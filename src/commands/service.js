let serviceCommand = __ServerBOT.registerCommand('service', (msg, args) => {
  return '**!help** service';
}, {
  description: 'Manages registered services',
  fullDescription: 'Use service list, start, stop and restart to manage services',
  usage: '<subcommand> <service>',
});

serviceCommand.registerSubcommand('list', (msg, args) => {
  let text = '';
  for (let service of __ServerBOT.config.services) {
    text = text + `${service.status ? ':white_check_mark:' : ':x:'} ${service.name} (${service.id})\n`;
  }
  return text;
}, {
  description: 'Lists registered services',
  fullDescription: 'The bot will list the registered services followed by their ID.',
  usage: '',
});
