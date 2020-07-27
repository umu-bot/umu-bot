const axios = require('axios');
const config = require('../../config.json');
const weather_key = config.weather_key;

module.exports = {
    name: 'weather',
    description: 'Gets the current weather for a given location',
    args: true,
    usage: '<city>',
    path: __filename,
    execute (message, args) {
        if (args.length > 0) {
            // capitaliza city name
            args = args.map(function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            });
            // combine city names with more than one word from args
            let cityName = args.join(" ");

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