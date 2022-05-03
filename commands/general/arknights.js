const { MessageEmbed } = require('discord.js');
const opList = require ('../../json/operators.json');
const baseURL = 'https://gamepress.gg';

module.exports = {
    name: 'ak',
    description: 'Displays Arknights operator info',
    args: true,
    usage: '<name>',
    path: __filename,
    execute (message, args) {

        for (const operator of opList) {
            if (operator.name.toLowerCase().includes(args[0])) { 

                let embed = new MessageEmbed()
                    .setColor('AQUA')
                    .setTitle(operator.name)
                    .setThumbnail(baseURL.concat(operator.icon))
                    .addFields(
                        { name: 'Class:', value: operator.stats.type, inline: true },
                        { name: 'Rarity:', value: '\u2605'.repeat(operator.stats.rarity), inline: true },
                        { name: 'Trait(s):', value: operator.traits },
                        { name: '\u200B', value: '**Talent(s):**' }
                    )
                ;

                for (const talent of operator.talents) {
                    embed.addFields({ name: talent.name, value: talent.desc });
                }

                return message.channel.send(embed);
            }
        }
        
        return message.channel.send("Operator not found.");
    }
}