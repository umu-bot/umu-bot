const axios = require('axios');
const { weather_api_key } = require('../../config.json');
const weather_key = weather_api_key;

module.exports = {
    name: 'weather',
    description: 'Gets the current weather for a given location',
    args: true,
    usage: '<city>',
    path: __filename,
    execute (message, args, ops) {
        if (args.length > 0) {
            // capitalize city name and join if more than one word
            let cityName = args.map(function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            }).join(" ");

            axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weather_key}`)
    
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp);
                let country = apiData.data.sys.country;
                message.channel.send(`The current temperature is ${currentTemp - 273}\xB0C in ${cityName}, ${country}`);
            }).catch(error => {
                message.reply(`Enter a valid city name! ${error}`);
            })
            // message.channel.send("Your city is: " + cityName);
        }
    }
}