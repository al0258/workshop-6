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

async function fetchWeatherInACity(cityName) {
  try {
    const requestString = new URLSearchParams({
      q: cityName,
      units: 'metric',
      appId: API_KEY,
    }).toString();
    console.log(requestString);
    const requestUrl = `${WEATHER_API_BASE_URL}/weather?${requestString}`;
    const response = await fetch(requestUrl);
    const weatherData = await response.json();

    return weatherData;
  }
  catch (err) {
    throw err;
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
  .action (async (cityName) => {
    const weatherData = await fetchWeatherInACity(cityName);
    const { temp: temp } = weatherData.main;
    console.log(`It's ${temp} degrees in ${cityName}`);
  });

program.parse();
