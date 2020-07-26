const axios = require('axios');
const weather_key = "e05ef843b55687fd7c552a1847e6c05f";

module.exports = {
    name: 'weather',
    description: 'Gets the current weather for a given location',
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
            message.channel.send("Your city is: " + cityName);
        }
        else {
            message.channel.send("Please enter a city (eg. !weather Toronto)");
        }
    }
}