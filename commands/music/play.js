const { MessageEmbed } = require('discord.js');
const { google_api_key } = require('../../config.json');
const ytdl = require ('ytdl-core');
const YouTube = require ('simple-youtube-api');
const youtube = new YouTube (google_api_key);

module.exports = {
    name: 'play',
    description: 'Plays music',
    args: true,
    usage: '<song name/URL>',
    caseSensitive: true,
    path: __filename,
    async execute (message, args, ops) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply ("you are not in a voice channel.");
        }

        const query = args.join(" ");

        // checks for YT playlist URL
        // /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)\/playlist(.*)+/
        // /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
        if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)\/playlist(.*)+/)) {
            const playlist = await youtube.getPlaylist(query);
            const videos = await playlist.getVideos();

            message.channel.send (`**Adding \`${playlist.length}\` songs...**`);

            for (const video of Object.values(videos)) {
                const currentVideo = await youtube.getVideoByID(video.id);
                await videoFn (currentVideo, message, voiceChannel, true);
                console.log("A");
            }

            return message.channel.send (`**Playlist \`${playlist.title}\` has been added to the queue.**`);            
        } else {

            // not a playlist; tries direct URL and then plaintext search
            try {
                var video = await youtube.getVideo(query);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(query, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('Unable to find video.');
                }
            }
            return videoFn(video, message, voiceChannel);
        }


        // gets info from video and adds to queue
        async function videoFn (video, message, channel, playlist = false) {
            const serverQueue = ops.queue.get(message.guild.id);
            // const songInfo = await ytdl.getInfo(video.id);
            const song = {
                id: video.id,
                title: video.title,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
                duration: video.duration
            };

            if (serverQueue) {
                serverQueue.songs.push(song);
                if (playlist) return;
                else {
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("Added To Queue")
                        .setThumbnail(song.thumbnail)
                        .setTimestamp()
                        .setDescription(`**${song.title}** has been added to queue.`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL());
                        message.channel.send (embed);
                }
                return;
            }

            // make a new queue if one does not exist
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                songs: [],
                volume: 2,
                playing: true
            };

            ops.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            // joins the voice channel
            try {
                const connection = await channel.join();
                queueConstruct.connection = connection;
                play(queueConstruct.songs[0]);
            } catch (error) {
                await channel.leave();
                return message.channel.send(`Could not join voice channel: ${error.message}`);
            }
        }

        // function to play song
        async function play(song) {
            const queue = ops.queue.get(message.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                ops.queue.delete(message.guild.id);
                return;
            }

            const dispatcher = queue.connection.play(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio'}))
                .on('finish', () => {
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on('error', error => console.error(error));

            let duration = [];
            for (let key in song.duration) {
                if (song.duration[key])
                duration.push(song.duration[key]);
            }
            duration = duration.join(":");

            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle('Now Playing\n')
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setDescription(`Now playing:\n **${song.title}**\n\nSong Length: **${duration}**`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL());
            queue.textChannel.send(embed);
        }
    }


}