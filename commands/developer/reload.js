module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    usage: '<command>',
    path: __filename,
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);
        if (!command) return message.channel.send(`The command \`${commandName}\`doesn't exist.`);

        delete require.cache[require.resolve(command.path)];

        try {
            const newCommand = require(command.path);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` reloaded.`);
        } catch (error) {
            console.log (error);
            message.channel.send(`There was an error while reloading \`${command.name}\``);
        }
    }
}