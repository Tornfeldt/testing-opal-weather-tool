# Opal Weather Tool

Minimal Optimizely Opal tool service that exposes a `get_weather` tool via the Opal Tools SDK.

## Local dev

1. Install dependencies
   - `npm install`
2. Run the server
   - `npm run dev`

The discovery endpoint is available at `http://localhost:3000/discovery`.

## Environment

- `OPENWEATHERMAP_API_KEY` (optional): if set, the tool will call the OpenWeatherMap API.
- `PORT` (optional): defaults to `3000`.

## Render deployment

Use these settings:

- Build command: `npm run build`
- Start command: `npm start`
- Environment variables: set `OPENWEATHERMAP_API_KEY` if you want live weather data.
