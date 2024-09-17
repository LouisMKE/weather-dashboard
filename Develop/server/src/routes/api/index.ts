import express from 'express';
import WeatherService from '../../service/weatherService.js'; // Adjust imports to include '.js'
import HistoryService from '../../service/historyService.js';

const router = express.Router();

// Get weather data for a city
router.get('/weather/:city', async (req, res) => {
  const { city } = req.params;

  try {
    const weather = await WeatherService.getWeatherForCity(city);
    res.json(weather);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Add a city to history
router.post('/city', async (req, res) => {
  const { cityName } = req.body;
  const city = await HistoryService.addCity(cityName);
  res.json(city);
});

// Get all cities from history
router.get('/cities', async (req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// Remove a city by ID from history
router.delete('/city/:id', async (req, res) => {
  const { id } = req.params;
  await HistoryService.removeCity(id);
  res.sendStatus(204);  // No content status code
});

export default router;
