module.exports = {
    name: 'stop',
    description: 'Stops music',
    path: __filename,
    async execute (message, args, ops) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply ("you are not in a voice channel.");
        }

        if (message.guild.me.voice.channel != message.member.voice.channel) {
            return message.reply ("you are not in the same channel as the bot.");
        }

        const queue = ops.queue.get(message.guild.id);
        
        try {
            if (queue) {
                queue.songs = [];
                queue.connection.dispatcher.end();
                message.guild.me.voice.channel.leave();
            } else {
                voiceChannel.leave();
            }
            return message.channel.send ('Music stopped.');
        } catch (err) {
            queue.connection.dispatcher.end();
            await voiceChannel.leave();
            return message.channel.send (`Error: ${err}`);
        }
    }
}
