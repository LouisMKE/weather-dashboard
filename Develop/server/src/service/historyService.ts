import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const searchHistoryFile = path.resolve('./searchHistory.json');

// City class
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();  // Generate a unique ID for each city
    this.name = name;
  }
}

class HistoryService {
  // Read method that reads from searchHistory.json
  private async read(): Promise<City[]> {
    try {
      const data = await readFile(searchHistoryFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Write method that writes to searchHistory.json
  private async write(cities: City[]): Promise<void> {
    try {
      await writeFile(searchHistoryFile, JSON.stringify(cities, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to search history:', error);
    }
  }

  // Get all cities from the searchHistory.json file
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a city to the search history
  async addCity(cityName: string): Promise<City> {
    const cities = await this.getCities();
    const city = new City(cityName);

    // Ensure that the city does not already exist
    const cityExists = cities.some(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (!cityExists) {
      cities.push(city);
      await this.write(cities);
    } else {
      console.log('City already exists in history');
    }

    return city;
  }

  // Remove a city from the search history by its ID
  async removeCity(id: string): Promise<void> {
    let cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);

    if (updatedCities.length === cities.length) {
      console.log('City not found');
      return;
    }

    await this.write(updatedCities);
    console.log('City removed successfully');
  }
}

export default new HistoryService();
