// Recommended order for your solution:
// 1. Install the dotenv package.
// 2. Add a dotenv file, put the API key in dotenv and print it.
// 3. Install the node-fetch package.
// 4. Create a method that calls the API to get temperature using node-fetch.
// 5. Install the commander package.
// 6. Create a basic commander skeleton without the actions implementation (just the metadata and commands configuration).
// 7. Implement the first command, including the optional arguments.
// 8. BONUS - Implement the second command.

// Commander usage example for your reference:
import chalk from "chalk";
import dotenv from "dotenv";
import { Command } from "commander";
import fetch from "node-fetch";
const program = new Command();

dotenv.config();

const API_KEY = process.env.API_KEY;

const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL;

async function fetchWeatherInACity(cityName, units) {
  try {
    const requestString = new URLSearchParams({
      q: cityName,
      units: units,
      appId: API_KEY,
    }).toString();
    const requestUrl = `${WEATHER_API_BASE_URL}/weather?${requestString}`;
    const response = await fetch(requestUrl);
    const weatherData = await response.json();

    return weatherData;
  }
  catch (err) {
    throw err;
  }
}

function convertUnits(scale) {
  switch (scale) {
    case 'c': {
      return 'metric';
    }
    case 'f': {
      return 'imperial';
    }
    default: {
      return 'metric';
    }
  }
}


program
  .name("Weather monday-u app")
  .description("The best weather app in the whole wide worl, sorry, web")
  .version("1.0.0");

program
  .command("get-temp")
  .description("Displays the temp of a selected city")
  .argument("<string>", "city name")
  .option("-s, --scale <string>", "c for celcius and f for the other thing.")
  .action (async (cityName, options) => {
    const units = convertUnits(options.scale);
    const weatherData = await fetchWeatherInACity(cityName, units);
    const {temp} = weatherData.main;
    console.log(`It's ${temp} degrees in ${cityName}`);
  });


  program
  .command("get-detailed-forecast")
  .description("Displays in depth information about today's weather forecast")
  .argument("<string>", "City name")
  .option("-s, --scale <string>", "c for celcius and f for the other thing.")
  .action(async (cityName, options) => {
    const units = convertUnits(options.scale);
    const weatherData = await fetchWeatherInACity(cityName, units);
    const { description: weatherDescription } = weatherData.weather[0];
    const { temp_min: minTemp, temp_max: maxTemp } = weatherData.main;
    const { speed: windSpeed } = weatherData.wind;

    console.log(
      `Today we will have ${weatherDescription}, temperatures will range from ${minTemp} to ${maxTemp} degrees with a wind speed of ${windSpeed}`
    );
  });

program.parse();
