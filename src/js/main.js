/**
 * main.js
 * Punto de entrada principal de la aplicación.
 * Orquesta la captura de eventos, validaciones, llamadas a la API y actualización de la vista.
 */

import { getCityCoordinates, getWeatherData } from './api.js';
import {
  renderWeather,
  showLoading,
  hideLoading,
  showError,
  clearError,
  clearWeather
} from './ui.js';

// Elementos interactivos del DOM
let searchForm = null;
let cityInput = null;

// Bandera para prevenir búsquedas simultáneas o superpuestas
let isSearching = false;

/**
 * Procesa la búsqueda meteorológica a partir del nombre de la ciudad.
 * @param {string} rawCityName - Nombre de la ciudad ingresada por el usuario.
 */
async function handleWeatherSearch(rawCityName) {
  // Protección contra búsquedas concurrentes
  if (isSearching) {
    return;
  }

  const cityName = (rawCityName || '').trim();

  // Validación de entrada vacía
  if (!cityName) {
    showError('Por favor, escribe el nombre de una ciudad para consultar el clima.');
    if (cityInput) cityInput.focus();
    return;
  }

  // Activar bandera de búsqueda
  isSearching = true;

  try {
    // 1. Preparar la interfaz e indicar carga
    clearError();
    clearWeather();
    showLoading();

    // 2. Obtener coordenadas geográficas mediante la Geocoding API de Open-Meteo
    const cityData = await getCityCoordinates(cityName);

    // 3. Consultar el pronóstico meteorológico actual con latitud y longitud
    const weatherData = await getWeatherData(cityData.latitude, cityData.longitude);

    // 4. Renderizar los datos en la tarjeta meteorológica
    renderWeather(weatherData, cityData);
  } catch (error) {
    // Manejo centralizado de fallas (red, ciudad no encontrada, errores de servidor)
    showError(error.message || 'Ocurrió un error inesperado al consultar el clima.');
  } finally {
    // 5. Garantizar SIEMPRE que el spinner se oculte y los controles se liberen
    hideLoading();
    isSearching = false;
  }
}

/**
 * Inicialización de listeners de eventos y configuración de arranque.
 */
function initApp() {
  searchForm = document.getElementById('search-form');
  cityInput = document.getElementById('city-input');

  if (!searchForm || !cityInput) {
    console.error('No se encontraron los elementos esenciales del formulario en el DOM.');
    return;
  }

  // Asegurar que cualquier estado residual de carga quede oculto de inmediato
  hideLoading();

  // Listener para el envío del formulario (cubre click en botón y tecla Enter)
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleWeatherSearch(cityInput.value);
  });

  // Limpiar mensaje de error cuando el usuario comienza a escribir nuevamente
  cityInput.addEventListener('input', () => {
    clearError();
  });

  // Foco automático en el input al cargar para que el usuario empiece de inmediato
  cityInput.focus();
}

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
