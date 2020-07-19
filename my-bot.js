const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

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
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "weather") {
        weatherCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("SCHLABA SCHLEEBEE use !help or !multiply");
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0 ) {
        receivedMessage.channel.send("UMIE UMIE " + arguments);
    } else {
        receivedMessage.channel.send("UMU UMU");
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

const weather_key = "e05ef843b55687fd7c552a1847e6c05f";

function weatherCommand(arguments, receivedMessage) {
    if (arguments.length > 0 ) {
        // capitalize city name
        arguments = arguments.map(function(string){ 
            return string.charAt(0).toUpperCase() + string.slice(1);
        });
        // combine city names with more than one word
        let cityName = arguments.join(" ");

        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weather_key}`)
    
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp);
                let country = apiData.data.sys.country;
                receivedMessage.channel.send(`The current temperature is ${currentTemp - 273} in ${cityName}, ${country}`);
            }).catch(error => {
                receivedMessage.reply(`Enter a valid city name! ${error}`);
            })
            receivedMessage.channel.send("Your city is: " + cityName);
    }
}

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

bot_secret_token = "NzMyNzE0MDA1MjYwNjY0ODMy.Xw4npA.xrQsgnRdimaVUdh8qOzEk0om3j8";

client.login(bot_secret_token);