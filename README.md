# WeatherRise — Telegram Weather Bot

A Telegram bot built with TypeScript, Telegraf, and Prisma. It sends daily morning weather forecasts and allows users to update their location via city search or GPS coordinates.

## Features

- **Daily Scheduled Forecasts:** Automatic weather notifications at 8:00 AM via `node-cron`.
- **Flexible Geolocation:** Location lookup by city name or precise GPS coordinates.
- **User Settings:** Interactive inline buttons to toggle notification status.
- **Database Storage:** User preferences and AccuWeather location keys stored in PostgreSQL using Prisma ORM.

## Tech Stack

| Category | Technologies |
|---|---|
| Language | TypeScript |
| Framework | Telegraf |
| Database & ORM | PostgreSQL, Prisma |
| External API | AccuWeather API |
| Utilities | node-cron, date-fns, dotenv |

## Setup and Run

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- API key from [AccuWeather API](https://developer.accuweather.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/alexmods40-dev/weather-telegram-bot.git
   cd weather-telegram-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the project root:

   ```env
   TELEGRAM=your_telegram_bot_token
   API=your_accuweather_api_key
   DATABASE_URL="postgresql://user:password@localhost:5432/weather_db?schema=public"
   ```

4. Generate the Prisma client and apply migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the bot:

   ```bash
   # Development mode
   npm run dev

   # Production build & start
   npm run build
   npm start
   ```

## Bot Usage

| Command | Description |
|---|---|
| `/start` | Initialize the bot and open the main menu |
| ⚙️ Settings | View saved city and toggle notification status |
| ❓ Help | View user instructions |

