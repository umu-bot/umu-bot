module.exports = {
    name: 'skip',
    description: 'Skips current track',
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
            queue.connection.dispatcher.end();
            return message.channel.send ('Skipped');
        } catch (err) {
            queue.connection.dispatcher.end();
            await voiceChannel.leave();
            return message.channel.send (`Error: ${err}`);
        }
    }
}
