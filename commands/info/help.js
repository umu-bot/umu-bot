module.exports = {
    name: 'help',
    description: 'SCHLABA SCHLEEBEE',
    usage: '<command name>',
    path: __filename,
    execute (message, args, ops) {
        const help = [];
        const { commands } = message.client;
        // sends a list of commands
        if (!args.length) {
            help.push ("List of commands: ");
            help.push (commands.map(command => command.name).join(', '));
            help.push ('\nUse !help <command name> to get info on a specific command.');
            return message.channel.send(help);
        }

        // sends info on a specific command
        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply('that command doesn\'t exist.')
        }

        help.push (`**Name: **${command.name}`);
        
        if (command.description) help.push(`**Description:** ${command.description}`);
        if (command.usage) help.push(`**Usage:** \`!${command.name} ${command.usage}\``);
        if (command.extras) help.push(`**Extra inputs:** \`${command.extras}\``);

        message.channel.send(help);
    }
}