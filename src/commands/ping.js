__ServerBOT.registerCommand('ping', 'Pong!', { // Make a ping command
  // Responds with 'Pong!' when someone says '!ping'
  description: 'Pong!',
  fullDescription: 'This command could be used to check if the bot is up. Or entertainment when you\'re bored.',
});

__ServerBOT.registerCommand('pong', ['Pang!', 'Peng!', 'Ping!', 'Pung!'], { // Make a pong command
  // Responds with a random version of 'Ping!' when someone says '!pong'
  description: 'Ping!',
  fullDescription: 'This command could also be used to check if the bot is up. Or entertainment when you\'re bored.',
});

__ServerBOT.registerCommand('pung', 'Pang!', { // Make a ping command
  // Responds with 'Pong!' when someone says '!ping'
  description: 'Pong!',
  fullDescription: 'This command could be used to check if the bot is up. Or entertainment when you\'re bored.',
  reactionButtons: [ // Add reaction buttons to the command
    {
      emoji: '⬅',
      type: 'edit',
      response: (msg) => { // Reverse the message content
        return msg.content.split().reverse().join();
      },
    },
    {
      emoji: '🔁',
      type: 'edit', // Pick a new pong variation
      response: ['Pang!', 'Peng!', 'Ping!', 'Pong!', 'Pung!'],
    },
    {
      emoji: '⏹',
      type: 'cancel', // Stop listening for reactions
    },
  ],
  reactionButtonTimeout: 30000, // After 30 seconds, the buttons won't work anymore
});
