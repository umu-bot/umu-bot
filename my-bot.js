const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

// Dynamically fetch command components from folder
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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

    // fetch command from the command list and execute it
    const command = client.commands.get(commandName);

    // check if commands that require arguments have arguments
    if (command.args && !arguments.length) {
        let reply = "Extra input required.";

        if (command.usage) {
            reply += `\nProper usage: \`!${command.name} ${command.usage}\``;
        }
        return receivedMessage.channel.send(reply);
    }

    try {
        command.execute(receivedMessage, arguments);
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
    
    let generalChannel = client.channels.cache.get("732713640657944588"); // Replace with known channel ID
    generalChannel.send("HELLOOOO!");

    
    // Provide a URL to a file
    const webAttachment = new Discord.MessageAttachment('https://i.imgur.com/9QamQDE.gif');
    generalChannel.send(webAttachment);

})

client.login(config.token);