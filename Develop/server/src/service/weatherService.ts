import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;

  constructor(temperature: number, windSpeed: number, humidity: number, description: string) {
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.description = description;
  }
}

interface WeatherAPIResponse {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
  }>;
  message?: string;
}

class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;

  constructor() {
    if (!this.baseURL || !this.apiKey) {
      throw new Error('API base URL or API key is missing from environment variables');
    }
  }

  // Fetch location data (coordinates) for a given city
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeQuery = this.buildGeocodeQuery(query);
    try {
      const response = await fetch(geocodeQuery);
      const data = await response.json();

      // Log the API response for debugging
      console.log('Geocoding API Response:', data);

      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Failed to fetch location data from OpenWeather API');
    }
  }

  // Destructure the location data to get coordinates
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];

    // Log lat and lon for debugging
    console.log('Coordinates:', { lat, lon });

    if (!lat || !lon) {
      throw new Error('Invalid coordinates received from API');
    }

    return { lat, lon };
  }

  // Fetch coordinates for a city and return them
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    try {
      const locationData = await this.fetchLocationData(city);

      // Log the response for debugging
      console.log('Location data from OpenWeather API:', locationData);

      // Check if the locationData array is valid and has at least one result
      if (!Array.isArray(locationData) || locationData.length === 0) {
        throw new Error(`No location data found for city: ${city}`);
      }

      return this.destructureLocationData(locationData);
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Failed to fetch coordinates for city');
    }
  }

  // Build the geocode query URL to get coordinates for a city
  private buildGeocodeQuery(city: string): string {
    const apiKey = this.apiKey;
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  }

  // Build the weather query URL to fetch weather data based on coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherAPIResponse> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(weatherQuery);
      const data = (await response.json()) as WeatherAPIResponse;

      // Log the weather data for debugging
      console.log('Weather data from OpenWeather API:', data);

      if (!response.ok) {
        console.error('OpenWeather API Error:', data);
        throw new Error(data.message || 'Failed to fetch weather data from OpenWeather API');
      }

      return data;
    } catch (error) {
      console.error('Network or API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  // Parse the current weather from the API response
  private parseCurrentWeather(response: WeatherAPIResponse): Weather {
    const temperature = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;
    const description = response.weather[0].description;
    return new Weather(temperature, windSpeed, humidity, description);
  }

  // Get weather for a city (main method to call)
  async getWeatherForCity(city: string): Promise<Weather> {
    try {
      // Fetch the coordinates of the city
      const coordinates = await this.fetchAndDestructureLocationData(city);

      // Fetch weather data using the coordinates
      const weatherData = await this.fetchWeatherData(coordinates);

      // Parse the current weather data and return it
      return this.parseCurrentWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default new WeatherService();
