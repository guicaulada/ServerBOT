let serviceCommand = __ServerBOT.registerCommand('service', (msg, args) => {
  return `**!help** ${msg.command.label}`;
}, {
  description: 'Manages registered services',
  fullDescription: 'Use service list, start, stop and restart to manage services',
  usage: '<subcommand> <service>',
});

serviceCommand.registerSubcommand('list', (msg, args) => {
  let text = '';
  for (let service of __ServerBOT.config.services) {
    if (service.status === undefined) {
      text = text + `:question: ${service.name} (${service.id})\n`;
    } else {
      text = text + `${service.status ? ':white_check_mark:' : ':x:'} ${service.name} (${service.id})\n`;
    }
  }
  return text;
}, {
  description: 'Lists registered services',
  fullDescription: 'The bot will list the registered services followed by their ID.',
  usage: '',
});

serviceCommand.registerSubcommand('info', (msg, args) => {
  if (args.length > 0) {
    __ServerBOT.deleteMessage(msg.channel.id, msg.id, 'Executing command...');
    let service = __ServerBOT.serviceById()[args[0]];
    let color = 0xFFFF00;
    let status = 'UNKNOWN';
    if (service.status === true) {
      status = 'UP';
      color = 0x00FF00;
    } else if (service.status === false) {
      status = 'DOWN';
      color = 0xFF0000;
    }

    let fields = [
      {
        name: 'PID',
        value: service.pid ? service.pid : '-',
        inline: true,
      },
      {
        name: 'PORT',
        value: service.port,
        inline: true,
      },
      {
        name: 'STATUS',
        value: status,
        inline: true,
      },
      {
        name: 'COMMAND',
        value: service.command.replace(/ +/g, '') ? service.command : '-',
        inline: false,
      },
      {
        name: 'ARGUMENTS',
        value: service.arguments.replace(/ +/g, '') ? service.arguments : '-',
        inline: false,
      },
    ];

    __ServerBOT.createMessage(msg.channel.id, {
      embed: {
        title: service.name,
        description: service.description,
        author: {
          name: msg.author.username,
          icon_url: msg.author.avatarURL,
        },
        color: color,
        fields: fields,
        footer: { // Footer text
          text: __ip + ':' + service.port,
        },
      },
    });
  } else {
    return `**!help** ${msg.command.parentCommand.label} ${msg.command.label}`;
  }
}, {
  description: 'Lists registered services',
  fullDescription: 'The bot will list the registered services followed by their ID.',
  usage: '<service>',
});

__ServerBOT.registerCommandAlias('server', 'service'); // Alias !server to !service
serviceCommand.registerSubcommandAlias('status', 'info'); // Alias '!service info' to '!service status'
