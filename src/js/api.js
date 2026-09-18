/**
 * api.js
 * Módulo de servicios de comunicación HTTP con la API de Open-Meteo.
 * Encargado de la geocodificación de ciudades y la consulta del pronóstico meteorológico.
 */

// Constantes de endpoints base de Open-Meteo
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Consulta la API de Geocoding para obtener las coordenadas geográficas de una ciudad.
 * @param {string} cityName - Nombre de la ciudad a buscar.
 * @returns {Promise<{name: string, country: string, countryCode: string, admin1: string, latitude: number, longitude: number, timezone: string}>} Coordenadas y datos geográficos.
 * @throws {Error} Mensaje descriptivo en caso de error de red o ciudad no encontrada.
 */
export async function getCityCoordinates(cityName) {
  const query = cityName.trim();

  if (!query) {
    throw new Error('El nombre de la ciudad no puede estar vacío.');
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=1&language=es&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en el servidor de geocodificación (Estado HTTP: ${response.status})`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(`No se encontró la ciudad "${query}". Por favor, revisa la ortografía e inténtalo de nuevo.`);
    }

    const [firstResult] = data.results;

    return {
      name: firstResult.name,
      country: firstResult.country || '',
      countryCode: firstResult.country_code || '',
      admin1: firstResult.admin1 || '',
      latitude: firstResult.latitude,
      longitude: firstResult.longitude,
      timezone: firstResult.timezone || 'auto'
    };
  } catch (error) {
    // Si ya es un error descriptivo lanzado por nosotros, lo propagamos
    if (error.message.includes('No se encontró') || error.message.includes('servidor') || error.message.includes('vacío')) {
      throw error;
    }
    // Error de red (offline, DNS, timeout, etc.)
    throw new Error('No fue posible conectar con el servicio de geocodificación. Revisa tu conexión a internet.');
  }
}

/**
 * Consulta la API de pronóstico meteorológico para obtener las condiciones actuales.
 * @param {number} latitude - Latitud geográfica.
 * @param {number} longitude - Longitud geográfica.
 * @returns {Promise<{temperature: number, windspeed: number, winddirection: number, weathercode: number, isDay: number, time: string}>} Datos actuales del clima.
 * @throws {Error} Mensaje descriptivo en caso de error de red o servidor.
 */
export async function getWeatherData(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Las coordenadas geográficas proporcionadas no son válidas.');
  }

  const url = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al consultar el clima actual (Estado HTTP: ${response.status})`);
    }

    const data = await response.json();

    if (!data.current_weather) {
      throw new Error('La respuesta del clima no contiene información meteorológica actual.');
    }

    return {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      winddirection: data.current_weather.winddirection,
      weathercode: data.current_weather.weathercode,
      isDay: data.current_weather.is_day,
      time: data.current_weather.time
    };
  } catch (error) {
    if (error.message.includes('Error al consultar') || error.message.includes('coordenadas') || error.message.includes('La respuesta')) {
      throw error;
    }
    throw new Error('Fallo de conexión al obtener los datos meteorológicos. Verifica tu conexión a internet.');
  }
}
