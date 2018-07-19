let serviceCommand = __ServerBOT.registerCommand('service', (msg, args) => {
  return `**!help** ${msg.command.label}`;
}, {
  description: 'Manages registered services',
  fullDescription: 'Use service list, start, stop and restart to manage services.',
  usage: '<subcommand> <service>',
});

serviceCommand.registerSubcommand('list', (msg, args) => {
  __ServerBOT.deleteMessage(msg.channel.id, msg.id, 'Executing command...');

  let text = '';
  for (let service of __ServerBOT.config.services) {
    if (service.status === undefined) {
      text = text + `:question: ${service.name} (${service.id})\n`;
    } else {
      text = text + `${service.status ? ':white_check_mark:' : ':x:'} ${service.name} (${service.id})\n`;
    }
  }

  let address = __ServerBOT.config.ip;
  if (__ServerBOT.config.dns) {
    address = __ServerBOT.config.dns;
  }

  __ServerBOT.createMessage(msg.channel.id, {
    embed: {
      title: 'Service List',
      description: text,
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL,
      },
      color: 0x0066cc,
      footer: { // Footer text
        text: address,
      },
    },
  });
}, {
  description: 'Lists registered services',
  fullDescription: 'The bot will list the registered services followed by their ID.',
  usage: '',
});

serviceCommand.registerSubcommand('info', (msg, args) => {
  if (args.length > 0) {
    __ServerBOT.deleteMessage(msg.channel.id, msg.id, 'Executing command...');
    let service = __ServerBOT.serviceById()[args[0]];
    if (service) {
      let color = 0xFFFF00;
      let status = 'UNKNOWN';
      let address = __ServerBOT.config.ip + ':' + service.port;

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
          value: service.pid,
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
          value: service.command,
          inline: false,
        },
        {
          name: 'ARGUMENTS',
          value: service.arguments,
          inline: false,
        },
      ];

      if (__ServerBOT.config.dns) {
        address = __ServerBOT.config.dns + ':' + service.port;
      }

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
            text: address,
          },
        },
      });
    } else {
      return `Couldn't find a service named ${args[0]}`;
    }
  } else {
    return `**!help** ${msg.command.parentCommand.label} ${msg.command.label}`;
  }
}, {
  description: 'Gives information about a service',
  fullDescription: 'The bot will list the service\'s PID, PORT, STATUS, COMMAND and ARGUMENTS.',
  usage: '<service>',
});

__ServerBOT.registerCommandAlias('server', 'service'); // Alias !server to !service
serviceCommand.registerSubcommandAlias('status', 'info'); // Alias '!service info' to '!service status'
