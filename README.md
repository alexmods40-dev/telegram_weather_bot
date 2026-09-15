# WeatherRise — Telegram Weather Bot

A Telegram bot built with TypeScript, Telegraf, and Prisma. It sends daily morning weather forecasts and allows users to update their location via city search or GPS coordinates.

## Features

- **Daily Scheduled Forecasts:** Automatic weather notifications at 8:00 AM via `node-cron`.
- **Flexible Geolocation:** Location lookup by city name or precise GPS coordinates.
- **User Settings:** Interactive inline buttons to toggle notification status.
- **Database Storage:** User preferences and AccuWeather location keys stored in PostgreSQL using Prisma ORM.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Telegraf
- **Database & ORM:** PostgreSQL, Prisma
- **External API:** AccuWeather API
- **Utilities:** node-cron, date-fns, dotenv

## Setup and Run

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- API key from [AccuWeather API](https://developer.accuweather.com/)

### Installation

1. **Clone the repository:**

   git clone [https://github.com/alexmods40-dev/weather-telegram-bot.git](https://github.com/alexmods40-dev/weather-telegram-bot.git)
   cd weather-telegram-bot

2. **Install dependencies:**
   npm install

3. **Configure environment variables:**
   Create a .env file in the project root:
   
   TELEGRAM=your_telegram_bot_token
   
   API=your_accuweather_api_key
   
   DATABASE_URL="postgresql://user:password@localhost:5432/weather_db?schema=public"

5. **Database Migration:**
   Generate Prisma client and push schema to PostgreSQL:
   
   npx prisma migrate dev --name init

7. **Start the Bot:**
   Development:
   
   npm run dev

   Production:
   
   npm run build
   
   npm start

#### Bot Usage
/start — Initialize the bot and open main menu.

⚙️ Settings — View saved city and toggle notification status.

❓ Help — View user instructions.
