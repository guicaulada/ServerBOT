let echoCommand = __ServerBOT.registerCommand('echo', (msg, args) => { // Make an echo command
  if (args.length === 0) { // If the user just typed '!echo', say 'Invalid input'
    return 'Invalid input';
  }
  let text = args.join(' '); // Make a string of the text after the command label
  return text; // Return the generated string
}, {
  description: 'Make the bot say something',
  fullDescription: 'The bot will echo whatever is after the command label.',
  usage: '<text>',
});

echoCommand.registerSubcommand('reverse', (msg, args) => { // Make a reverse subcommand under echo
  if (args.length === 0) { // If the user just typed '!echo reverse', say 'Invalid input'
    return 'Invalid input';
  }
  let text = args.join(' '); // Make a string of the text after the command label
  text = text.split('').reverse().join(''); // Reverse the string
  return text; // Return the generated string
}, {
  description: 'Make the bot say something in reverse',
  fullDescription: 'The bot will echo, in reverse, whatever is after the command label.',
  usage: '<text>',
});

echoCommand.registerSubcommandAlias('backwards', 'reverse'); // Alias '!echo backwards' to '!echo reverse'
