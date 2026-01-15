import { ParameterType, ToolsService, tool } from '@optimizely-opal/opal-tools-sdk';
import express from 'express';

interface WeatherParameters {
  city: string;
  state?: string;
  country: string;
  units?: string;
}

interface WeatherResponse {
  temperature: number;
  condition: string;
  location: string;
}

interface CountryParameters {
  city: string;
}

interface CountryResponse {
  country: string;
}

const app = express();

// This is required for the tool to properly read and understand the incoming JSON POST requests from Opal.
app.use(express.json());

// Basic health endpoint for hosting providers
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});


// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
});

// Register the configured app with the Opal ToolsService
// This allows the service to properly setup API endpoints as well as communicate properly with your functions
const toolsService = new ToolsService(app);
void toolsService;

// If you want to use the @tool decorator, your functions must be within a class declaration.
class WeatherTools {

  // Register the tool. Provide a meaningful descriptions to help Opal understand how to use this tool.
  @tool({
    name: 'get_weather',
    description: 'Gets current weather for a location based on City name, State or Region code, and Country code. Set preferred Units.',
    parameters: [
      {
        name: "city",
        description: "The name of the city.",
        type: ParameterType.String,
        required: true
      },
      {
        name: "state",
        description: "The code for the state. E.g. 'KY' for Kentucky or 'NSW' for New South Wales.",
        type: ParameterType.String,
        required: false
      },
      {
        name: "country",
        description: "The country code. E.g. 'US' for United States or 'FR' for France.",
        type: ParameterType.String,
        required: true
      },
      {
        name: "units",
        description: "Options are Imperial for Fahrenheit, Metric for Celcius. If left blank, this will return temperature in Kelvin.",
        type: ParameterType.String,
        required: true
      }
    ]
  })
  async getWeather(parameters: WeatherParameters): Promise<WeatherResponse> {
    try {
      const { city, state, country, units = '' } = parameters;
      // Validate required parameters
      if ((!city || city.trim() === '') ||
          (!country || country.trim() === '')) {
        throw new Error('City and Country are required and cannot be empty');
      }

      // Return mock data only.
      const weatherData: WeatherResponse = {
        temperature: units === 'fahrenheit' ? 72 : 22,
        condition: 'sunny',
        location: `${city}, ${state}, ${country}`,
      };

      // Return response to Opal
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error(`Failed to get weather for ${parameters.city}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @tool({
    name: 'get_country',
    description: 'Returns the country for a given city name.',
    parameters: [
      {
        name: "city",
        description: "The name of the city.",
        type: ParameterType.String,
        required: true
      }
    ]
  })
  async getCountry(parameters: CountryParameters): Promise<CountryResponse> {
    const { city } = parameters;
    if (!city || city.trim() === '') {
      throw new Error('City is required and cannot be empty');
    }

    return { country: 'Denmark' };
  }
}

// Discovery endpoint is automatically created at /discovery by ToolsService
// Tool execution endpoints are automatically created by ToolsService

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Opal Tools service running on port ${PORT}`);
  console.log(`Discovery endpoint automatically available at http://localhost:${PORT}/discovery`);
});

export default app;
