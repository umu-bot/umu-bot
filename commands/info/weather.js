const { MessageEmbed } = require('discord.js');
const { weather_api_key } = require('../../config.json');
const axios = require('axios');
const weather_key = weather_api_key;

module.exports = {
    name: 'weather',
    description: 'Gets the weather for a given location',
    usage: '<city>',
    extras: '<f: forecast>',
    path: __filename,
    execute (message, args, ops) {

        // default city
        let cityName = "Windsor";
        let country = "";

        let forecast = false;
        if (args.includes("forecast") || args.includes("f")) {
            forecast = true;
            args = args.filter(arg => !(arg === "forecast" || arg === "f"));
        }

        if (args.length > 0) {
            // capitalize city name and join if more than one word
            cityName = args.map(function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            }).join(" ");
        }

        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weather_key}`)

        // 1st API call to get lat/long of city name
        .then(response => {
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            country = response.data.sys.country;
            return axios
            .get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly&appid=${weather_key}`)

            // 2nd API call to get weather info from onecall API
        }).then(response => {
            let currentTemp = Math.round(response.data.current.temp * 10) / 10;
            let feelsLike = Math.round(response.data.current.feels_like * 10) / 10;
            let weather = response.data.current.weather[0].description;
            weather = weather.charAt(0).toUpperCase() + weather.slice(1);
            let embed;

            // 3 day forecast
            if (forecast) {
                embed = new MessageEmbed()
                    .setColor ("BLUE")
                    .setTitle (`Forecast for ${cityName}, ${country}`)
                    .setThumbnail (`http://openweathermap.org/img/wn/${response.data.daily[0].weather[0].icon}@2x.png`);

                for (let i = 0; i <= 2; i++) {
                    embed
                        .addField (`${new Date(response.data.daily[i].dt * 1000).toLocaleString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric"
                        })}`, '\u200B')
                        .addFields(
                            { name: 'Day', value: `${Math.round(response.data.daily[i].temp.day * 10) / 10}\xB0C`, inline: true },
                            { name: 'Low', value: `${Math.round(response.data.daily[i].temp.min * 10) / 10}\xB0C`, inline: true },
                            { name: 'Hi', value: `${Math.round(response.data.daily[i].temp.max * 10) / 10}\xB0C`, inline: true },
                            { name: 'Weather', value: `${response.data.daily[i].weather[0].main}`, inline: true },
                            { name: 'Humidity', value: `${response.data.daily[i].humidity}%`, inline: true },
                            { name: 'Chance of rain', value: `${Math.round(response.data.daily[i].pop * 100)}%`, inline: true },
                        )
                    ;

                    if (i < 2) embed.addField ('\u200B', '\u200B');
                }

            } else {

                // current weather
                embed = new MessageEmbed()
                    .setColor ("BLUE")
                    .setTitle (`Weather for ${cityName}, ${country}`)
                    .setThumbnail (`http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`)
                    .setDescription (weather)
                    .addFields(
                        { name: 'Current Temp', value: `${currentTemp}\xB0C` },
                        { name: 'Feels Like', value: `${feelsLike}\xB0C` },
                        { name: 'Wind', value: `${response.data.current.wind_speed}km/h ${getCardinal(response.data.current.wind_deg)}`, inline: true },
                        { name: 'Humidity', value: `${response.data.current.humidity}%`, inline: true },
                        { name: 'Chance of rain', value: `${response.data.daily[0].pop * 100}%`, inline: true }
                    )
                ;
            }

            embed.setFooter ('Retrieved from OpenWeatherAPI', 'http://openweathermap.org/img/wn/02d@2x.png');
            message.channel.send(embed);

        }).catch(error => {
            message.reply(`Error: ${error}`);
        })

        // helper function to convert from degrees to direction
        function getCardinal(angle) {
            const direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            const interval = 45;
            angle += interval / 2;
            for (let i = 0; i < direction.length; i++){
                if (angle >= (i * interval) && angle < (i + 1) * interval) return direction[i];
            }
            return direction[0];
        }        
    }
}