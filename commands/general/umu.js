const { MessageAttachment } = require('discord.js');
const stickerList = require ('../../json/sticker.json');

module.exports = {
    name: 'umu',
    description: 'umie umie',
    path: __filename,
    execute (message, args) {

        // sends a random sticker if no arguments
        if (!args.length) {
            const sticker = stickerList[shuffle(stickerList.length)];
            const img = new MessageAttachment(`${sticker.img[shuffle(sticker.img.length)]}`);
            return message.channel.send (img);

        } else if (args[0] == "list") {
            // return list of stickers
            const list = [];
            for (const sticker of stickerList){
                for (const name of sticker.name){
                    list.push (name);
                }
            }
            return message.channel.send(`\`${list.join(" ")}\``);

        } else {
            // checks sticker.json for matching sticker
            for (const sticker of stickerList) {
                if (sticker.name.includes(args[0])) { 
                    const img = new MessageAttachment(`${sticker.img[shuffle(sticker.img.length)]}`);
                    return message.channel.send(img);
                }
            }
        }
        return;

        function shuffle(length) {
            return Math.floor(Math.random() * length);
        }
    }
}