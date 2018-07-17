const fs = require('fs');

const playCommand = '!play';
__ServerBOT.on('messageCreate', (msg) => { // When a message is created
  if (msg.content.startsWith(playCommand)) { // If the message content starts with '!play '
    if (msg.content.length <= playCommand.length + 1) { // Check if a filename was specified
      __ServerBOT.createMessage(msg.channel.id, 'Please specify a filename.');
      return;
    }
    if (!msg.channel.guild) { // Check if the message was sent in a guild
      __ServerBOT.createMessage(msg.channel.id, 'This command can only be run in a server.');
      return;
    }
    if (!msg.member.voiceState.channelID) { // Check if the user is in a voice channel
      __ServerBOT.createMessage(msg.channel.id, 'You are not in a voice channel.');
      return;
    }
    const filename = msg.content.substring(playCommand.length + 1); // Get the filename
    const path = './assets/play/' + filename;
    if (fs.existsSync(path)) {
      __ServerBOT.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
        __ServerBOT.createMessage(msg.channel.id, 'Error joining voice channel: ' + err.message); // Notify the user if there is an error
        console.log(err); // Log the error
      }).then((connection) => {
        if (connection.playing) { // Stop playing if the connection is playing something
            connection.stopPlaying();
        }
        connection.play(path); // Play the file and notify the user
        __ServerBOT.createMessage(msg.channel.id, `Now playing **${filename}**`);
        connection.once('end', () => {
            __ServerBOT.createMessage(msg.channel.id, `Finished **${filename}**`); // Say when the file has finished playing
        });
      });
    } else {
      __ServerBOT.createMessage(msg.channel.id, `Could not find **${filename}**`);
    }
  }
});
