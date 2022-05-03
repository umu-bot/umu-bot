const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const queue = new Map();

// Dynamically fetch command components from folder
const { readdirSync } = require('fs');
client.commands = new Discord.Collection();

const load = (dir = "./commands/") => {
    // searches each folder in commands
    readdirSync(dir).forEach(dirs => {
        // adds all command components from subfolder
        const commandFiles = readdirSync(`${dir}${dirs}/`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${dir}${dirs}/${file}`);
            client.commands.set(command.name, command);
        }
    })
}

load();

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let commandName = splitCommand[0].toLowerCase(); // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command


    // checks if command is in the list of commands
    if (!client.commands.has(commandName)) {
        receivedMessage.channel.send("SCHLABA SCHLEEBEE use !help");
        return;
    }

    // fetch command from the command list
    const command = client.commands.get(commandName);

    // check if commands that require arguments have arguments
    if (command.args && !arguments.length) {
        let reply = "Extra input required.";

        if (command.usage) {
            reply += `\nProper usage: \`!${command.name} ${command.usage}\``;
        }
        return receivedMessage.channel.send(reply);
    }

    // checks if args are case sensitive (ex. certain URLs and file names)
    if (!command.caseSensitive) {
        arguments = arguments.map(arg => arg.toLowerCase());
    }

    let ops = {
        queue: queue,
    }

    try {
        command.execute(receivedMessage, arguments, ops);
    } catch (error) {
        console.error(error);
        receivedMessage.reply('oopsie woopsie');
    }
}

// }

client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);

        })
    })

    let generalChannel = client.channels.cache.get("659132704251445259"); // Replace with known channel ID
    generalChannel.send("HELLOOOO!");


    // Provide a URL to a file
    const webAttachment = new Discord.MessageAttachment('https://i.imgur.com/9QamQDE.gif');
    generalChannel.send(webAttachment);

})

// UnhandledPromiseRejectionWarnings
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(config.token);