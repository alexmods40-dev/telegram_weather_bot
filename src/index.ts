import { Telegraf, Markup } from 'telegraf';
import { fetchLocationData } from './utils/fetchLocationData.js';
import { fetchWeatherData } from './utils/fetchWeatherData.js';
import { fetchLocationDataByGeo } from './utils/fetchLocationDataByGeo.js';
import { config } from 'dotenv';
import { PrismaClient } from './generated/prisma/client.js';
import cron from 'node-cron';
import { format } from 'date-fns';


config();
export const prisma = new PrismaClient();
const key = process.env.TELEGRAM!;
const bot = new Telegraf(key);


cron.schedule('0 8 * * *', async () => {
    const date = format(Date.now(), 'EEEE, dd LLLL');
    const users = await prisma.user.findMany({ where: { isActiveNotification: true } });
    for (const user of users) {
        if(!user.locationKey) continue;
        const weatherData = await fetchWeatherData(user.locationKey);
        if(!weatherData) continue;
        let rainText = (weatherData.day.HasPrecipitation || weatherData.night.HasPrecipitation) 
            ? "🌧️ Don't forget your umbrella, precipitation is expected!" 
            : "No rain is expected, so it's a great day to be outside!";

        const message = `*Good morning, ${user.city}! ☀️*\n*Weather forecast for: ${date}*\n\nExpect a high of *${weatherData.temp.Maximum.Value}°${weatherData.temp.Maximum.Unit}* and a low of* ${weatherData.temp.Minimum.Value}°${weatherData.temp.Minimum.Unit}* today.\n\nThe day will be ${weatherData.day.IconPhrase.toLowerCase()}, turning ${weatherData.night.IconPhrase.toLowerCase()} tonight.\n\n*${rainText}*`;
        bot.telegram.sendMessage(user.telegramId, message, {parse_mode: "Markdown"});
    }
});

bot.command('start', (ctx) => {
    ctx.reply('*Welcome to WeatherRise! 🌦*\n\nI deliver a personalized weather report to you every day at 8:00 AM.\n\n*Set your location:*\n✍️ Type and send your City Name.\n*OR*\n📍 Share your Geolocation for more precise local data.\n\nYou can change your location at any time in the settings!', {parse_mode: "Markdown", ...Markup.keyboard([[Markup.button.locationRequest('📍 Share My Location')], ['⚙️ Settings', '❓ Help']]).resize()});
});

bot.hears('⚙️ Settings', async (ctx) => {
    const userData = await prisma.user.findUnique({where: {telegramId: ctx.from.id.toString()}});
    if(!userData) return ctx.reply('User not found!')
    await ctx.reply('🔔 You receive the following weather notifications for:');
    await ctx.reply(`*City:* ${userData.city}\n*Notifications:* ${userData.isActiveNotification ? 'Active' : 'Not active'}`, {parse_mode: "Markdown", ...Markup.inlineKeyboard([Markup.button.callback('❌ Deactivate', `deactivate_${userData.id}`)])});
});

bot.hears('❓ Help', (ctx) => {
    ctx.reply('*📖 WeatherRise Help Guide*\n\nIm here to make sure you are always prepared for the day! Here is how to use this bot:\n\n*🌤 Daily Forecasts*\nEvery morning at 8:00 AM, I will send you a detailed weather report for your chosen location.\n\n*📍 Changing Location*\nTo change your city, simply type the name of the city in the chat and send it. You can also send your current GPS location for better precision.\n\n*⚙️ Managing Settings*\nClick the Settings button to see which city is currently saved or to Deactivate notifications if you want to take a break.', {parse_mode: "Markdown"});
});

bot.on('location', async (ctx) => {
    const telegramId = ctx.from.id.toString();
    const { latitude, longitude } = ctx.message.location;
    if(!latitude || !longitude) return ctx.reply('Oops! Something went wrong while searching for your location.\nTry to send yor GEO location again!');
    try {
        const cityData = await fetchLocationDataByGeo(latitude, longitude);
        if(!cityData) return ctx.reply('Oops! Something went wrong while searching for your location.');
        await ctx.reply('🔔 You will receive weather notifications for:');
        ctx.reply(`📍 Your city is: ${cityData.EnglishName}\nCountry: ${cityData.LocalizedCountyName}`);
        await prisma.user.upsert({
            where: {telegramId: telegramId},
            update: {city: cityData.EnglishName, locationKey: cityData.Key, isActiveNotification: true},
            create: {
                telegramId: telegramId,
                city: cityData.EnglishName,
                locationKey: cityData.Key,
            }
        });
    } catch(error: unknown) {
        console.log((error as Error).message);
        ctx.reply('Oops! Something went wrong while saving your location.');
    }


});

bot.action(/deactivate_(.+)/, async (ctx) => {
    const userId = ctx.match[1];
    if(!userId) return ctx.reply('Your data not found! Try to add city!');
    const user = await prisma.user.findUnique({where: {id: +userId}});
    if(!user) return ctx.reply('User not found!');
    await prisma.user.update({where: {id: +userId}, data: {isActiveNotification: false}});
    ctx.reply(`❌ You will no longer receive weather notifications for city: ${user.city}`);
});

bot.on('text', async (ctx) => {
    const city = ctx.message.text.trim();
    const telegramId = ctx.from.id.toString();
    if(!city) return ctx.reply('Invalid city!');
    try {
        const cityData = await fetchLocationData(city);
        await ctx.reply('🔔 You will receive weather notifications for:');
        ctx.reply(`📍 Your city is: ${cityData.EnglishName}\n📍 Country: ${cityData.LocalizedCountyName}`);
        await prisma.user.upsert({
            where: {telegramId: telegramId},
            update: {city: cityData.EnglishName, locationKey: cityData.Key, isActiveNotification: true},
            create: {
                telegramId: telegramId,
                city: cityData.EnglishName,
                locationKey: cityData.Key,
            }
        });
    } catch(error: unknown) {
        console.log((error as Error).message);
        ctx.reply('Oops! Something went wrong while saving your location.');
    }
});

bot.launch();