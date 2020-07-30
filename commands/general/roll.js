const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = { 
    name: 'roll',
    description: 'Rolls dice',
    usage: '<number>',
    path: __filename,
    async execute(message, args, ops) {

        const colors = ['r', 'o', 'y', 'g', 'b', 'p'];
        const defaultWidth = 85;
        const spacing = 10;
        let sum = 0;
        let rolls = [];
        // default number to roll
        let num = 1;
        if (args && !isNaN(args[0])) {
            num = parseInt(args[0]);
        }

        if (num > 10) {
            return message.channel.send ("I don't have that many dice.");
        }

        const canvas = Canvas.createCanvas((defaultWidth * num) + (spacing * (num - 1)), defaultWidth);
        const ctx = canvas.getContext('2d');

        // roll i amount of dice, draw dice and add to total
        for (let i = 0; i < num; i++) {
            const dice = roll() + 1;
            const color = colors[roll()];
            const img = await Canvas.loadImage(`./assets/dice/${dice}${color}.png`);

            const offset = i * (defaultWidth + spacing);
            ctx.drawImage(img, offset, 0, 85, 85);
            sum += dice;
            rolls.push(dice);
        }

        const image = new MessageAttachment(canvas.toBuffer(), 'roll.png');
        const embed = new MessageEmbed()
            .setColor("PURPLE")
            .setTitle(`${message.member.displayName} rolled a ${sum}!`)
            .attachFiles(image)
            .setImage('attachment://roll.png')
            .setFooter(rolls.join(", "), message.author.displayAvatarURL())
            ;

        message.channel.send(embed);

        function roll () {
            return Math.floor(Math.random() * 6);
        }
    }
}