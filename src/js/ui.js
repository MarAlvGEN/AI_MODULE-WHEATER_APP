/**
 * ui.js
 * Módulo de manipulación del DOM y renderizado de la interfaz de usuario.
 * Controla la visualización de estados (carga, errores) y la tarjeta meteorológica.
 */

// Referencias dinámicas a los elementos principales del DOM
const elements = {
  get statusContainer() { return document.getElementById('status-container'); },
  get loadingIndicator() { return document.getElementById('loading-indicator'); },
  get weatherSection() { return document.getElementById('weather-section'); },
  get searchForm() { return document.getElementById('search-form'); },
  get searchInput() { return document.getElementById('city-input'); },
  get searchBtn() { return document.getElementById('search-btn'); }
};

/**
 * Escapa cadenas de texto para prevenir inyecciones XSS al renderizar contenido dinámico.
 * @param {string} str - Texto a escapar.
 * @returns {string} Texto seguro.
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generador de iconos vectoriales SVG limpios e incrustados para cada condición climática.
 */
const ICONS = {
  sun: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="14" fill="#FDB813" />
      <g stroke="#FDB813" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
      </g>
    </svg>
  `,
  moon: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M42 46C29.8497 46 20 36.1503 20 24C20 18.5724 21.9616 13.6017 25.228 9.77124C16.5186 12.3551 10 20.3702 10 29.8788C10 42.0959 19.9041 52 32.1212 52C40.6729 52 48.0641 46.8043 51.2721 39.3804C48.5147 43.4682 45.4526 46 42 46Z" fill="#E2E8F0" />
      <circle cx="48" cy="18" r="1.5" fill="#FDB813" />
      <circle cx="54" cy="26" r="1" fill="#FDB813" />
    </svg>
  `,
  partlyCloudyDay: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="10" fill="#FDB813" />
      <g stroke="#FDB813" stroke-width="3" stroke-linecap="round">
        <line x1="24" y1="6" x2="24" y2="10" />
        <line x1="8" y1="24" x2="12" y2="24" />
        <line x1="11.3" y1="11.3" x2="14.1" y2="14.1" />
      </g>
      <path d="M48 48H22C17.5817 48 14 44.4183 14 40C14 35.867 17.1332 32.4674 21.1707 32.0468C22.6284 25.1788 28.6946 20 36 20C44.8366 20 52 27.1634 52 36C52 36.341 51.9893 36.6796 51.9682 37.0152C53.7663 37.9863 55 39.851 55 42C55 45.3137 52.3137 48 49 48H48Z" fill="#CBD5E1" opacity="0.95" />
    </svg>
  `,
  partlyCloudyNight: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M28 32C23.5817 32 20 28.4183 20 24C20 21.055 21.5898 18.4804 23.9431 17.0784C20.4079 17.8841 17.5 21.011 17.5 24.8C17.5 29.3287 21.1713 33 25.7 33C27.9627 33 30.0076 32.0827 31.4883 30.6015C30.4357 31.4842 29.2778 32 28 32Z" fill="#E2E8F0" />
      <path d="M48 48H22C17.5817 48 14 44.4183 14 40C14 35.867 17.1332 32.4674 21.1707 32.0468C22.6284 25.1788 28.6946 20 36 20C44.8366 20 52 27.1634 52 36C52 36.341 51.9893 36.6796 51.9682 37.0152C53.7663 37.9863 55 39.851 55 42C55 45.3137 52.3137 48 49 48H48Z" fill="#94A3B8" />
    </svg>
  `,
  cloud: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 46H20C15.5817 46 12 42.4183 12 38C12 33.867 15.1332 30.4674 19.1707 30.0468C20.6284 23.1788 26.6946 18 34 18C42.8366 18 50 25.1634 50 34C50 34.341 49.9893 34.6796 49.9682 35.0152C52.7663 35.9863 54.5 38.851 54.5 41C54.5 43.7614 52.2614 46 49.5 46H48Z" fill="#94A3B8" />
      <path d="M40 50H16C12.6863 50 10 47.3137 10 44C10 40.9002 12.35 38.3506 15.378 38.035C16.4713 32.8841 21.021 29 26.5 29C33.1274 29 38.5 34.3726 38.5 41C38.5 41.2558 38.492 41.5097 38.4762 41.7614C40.5747 42.4897 42 44.5772 42 47C42 48.6569 40.6569 50 39 50H40Z" fill="#CBD5E1" />
    </svg>
  `,
  rain: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 38H20C15.5817 38 12 34.4183 12 30C12 25.867 15.1332 22.4674 19.1707 22.0468C20.6284 15.1788 26.6946 10 34 10C42.8366 10 50 17.1634 50 26C50 26.341 49.9893 26.6796 49.9682 27.0152C52.7663 27.9863 54.5 30.851 54.5 33C54.5 35.7614 52.2614 38 49.5 38H48Z" fill="#64748B" />
      <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round">
        <line x1="22" y1="44" x2="18" y2="52" />
        <line x1="32" y1="44" x2="28" y2="52" />
        <line x1="42" y1="44" x2="38" y2="52" />
      </g>
    </svg>
  `,
  heavyRain: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 36H20C15.5817 36 12 32.4183 12 28C12 23.867 15.1332 20.4674 19.1707 20.0468C20.6284 13.1788 26.6946 8 34 8C42.8366 8 50 15.1634 50 24C50 24.341 49.9893 24.6796 49.9682 25.0152C52.7663 25.9863 54.5 28.851 54.5 31C54.5 33.7614 52.2614 36 49.5 36H48Z" fill="#475569" />
      <g stroke="#0284C7" stroke-width="3.5" stroke-linecap="round">
        <line x1="20" y1="42" x2="14" y2="54" />
        <line x1="30" y1="42" x2="24" y2="54" />
        <line x1="40" y1="42" x2="34" y2="54" />
        <line x1="48" y1="42" x2="42" y2="54" />
      </g>
    </svg>
  `,
  thunderstorm: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 36H20C15.5817 36 12 32.4183 12 28C12 23.867 15.1332 20.4674 19.1707 20.0468C20.6284 13.1788 26.6946 8 34 8C42.8366 8 50 15.1634 50 24C50 24.341 49.9893 24.6796 49.9682 25.0152C52.7663 25.9863 54.5 28.851 54.5 31C54.5 33.7614 52.2614 36 49.5 36H48Z" fill="#334155" />
      <polygon points="32,38 24,48 30,48 26,58 38,46 32,46" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `,
  snow: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 36H20C15.5817 36 12 32.4183 12 28C12 23.867 15.1332 20.4674 19.1707 20.0468C20.6284 13.1788 26.6946 8 34 8C42.8366 8 50 15.1634 50 24C50 24.341 49.9893 24.6796 49.9682 25.0152C52.7663 25.9863 54.5 28.851 54.5 31C54.5 33.7614 52.2614 36 49.5 36H48Z" fill="#94A3B8" />
      <g stroke="#E0F2FE" stroke-width="3" stroke-linecap="round">
        <circle cx="22" cy="46" r="2" fill="#BAE6FD" />
        <circle cx="32" cy="50" r="2" fill="#BAE6FD" />
        <circle cx="42" cy="46" r="2" fill="#BAE6FD" />
        <circle cx="27" cy="56" r="2" fill="#BAE6FD" />
        <circle cx="37" cy="56" r="2" fill="#BAE6FD" />
      </g>
    </svg>
  `,
  fog: `
    <svg class="weather-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="#94A3B8" stroke-width="4" stroke-linecap="round">
        <line x1="16" y1="22" x2="48" y2="22" />
        <line x1="12" y1="30" x2="52" y2="30" />
        <line x1="16" y1="38" x2="48" y2="38" />
        <line x1="20" y1="46" x2="44" y2="46" />
      </g>
    </svg>
  `
};

/**
 * Mapeo de códigos meteorológicos WMO (World Meteorological Organization)
 * a descripciones amigables en español e iconos vectoriales.
 * @param {number} code - Código de clima WMO.
 * @param {number} isDay - 1 para día, 0 para noche.
 * @returns {{description: string, icon: string, theme: string}} Objeto con la condición meteorológica.
 */
function getWeatherCondition(code, isDay = 1) {
  const isDaytime = Boolean(isDay);

  switch (code) {
    case 0:
      return {
        description: isDaytime ? 'Cielo despejado' : 'Noche despejada',
        icon: isDaytime ? ICONS.sun : ICONS.moon,
        theme: isDaytime ? 'theme-clear-day' : 'theme-clear-night'
      };
    case 1:
      return {
        description: isDaytime ? 'Mayormente despejado' : 'Noche mayormente despejada',
        icon: isDaytime ? ICONS.partlyCloudyDay : ICONS.partlyCloudyNight,
        theme: 'theme-partly-cloudy'
      };
    case 2:
      return {
        description: 'Parcialmente nublado',
        icon: isDaytime ? ICONS.partlyCloudyDay : ICONS.partlyCloudyNight,
        theme: 'theme-partly-cloudy'
      };
    case 3:
      return {
        description: 'Nublado',
        icon: ICONS.cloud,
        theme: 'theme-cloudy'
      };
    case 45:
    case 48:
      return {
        description: code === 45 ? 'Niebla' : 'Niebla con escarcha',
        icon: ICONS.fog,
        theme: 'theme-fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        description: code === 51 ? 'Llovizna ligera' : code === 53 ? 'Llovizna moderada' : 'Llovizna densa',
        icon: ICONS.rain,
        theme: 'theme-rain'
      };
    case 56:
    case 57:
      return {
        description: 'Llovizna helada',
        icon: ICONS.snow,
        theme: 'theme-snow'
      };
    case 61:
    case 63:
    case 65:
      return {
        description: code === 61 ? 'Lluvia ligera' : code === 63 ? 'Lluvia moderada' : 'Lluvia fuerte',
        icon: code === 65 ? ICONS.heavyRain : ICONS.rain,
        theme: 'theme-rain'
      };
    case 66:
    case 67:
      return {
        description: 'Lluvia helada',
        icon: ICONS.snow,
        theme: 'theme-snow'
      };
    case 71:
    case 73:
    case 75:
      return {
        description: code === 71 ? 'Nevada ligera' : code === 73 ? 'Nevada moderada' : 'Nevada intensa',
        icon: ICONS.snow,
        theme: 'theme-snow'
      };
    case 77:
      return {
        description: 'Granizo menudo',
        icon: ICONS.snow,
        theme: 'theme-snow'
      };
    case 80:
    case 81:
    case 82:
      return {
        description: code === 80 ? 'Chubascos ligeros' : code === 81 ? 'Chubascos moderados' : 'Chubascos violentos',
        icon: ICONS.heavyRain,
        theme: 'theme-rain'
      };
    case 85:
    case 86:
      return {
        description: 'Chubascos de nieve',
        icon: ICONS.snow,
        theme: 'theme-snow'
      };
    case 95:
      return {
        description: 'Tormenta eléctrica',
        icon: ICONS.thunderstorm,
        theme: 'theme-thunderstorm'
      };
    case 96:
    case 99:
      return {
        description: 'Tormenta con granizo',
        icon: ICONS.thunderstorm,
        theme: 'theme-thunderstorm'
      };
    default:
      return {
        description: 'Condición no especificada',
        icon: ICONS.cloud,
        theme: 'theme-cloudy'
      };
  }
}

/**
 * Muestra el indicador visual de carga y deshabilita los controles del formulario.
 */
export function showLoading() {
  clearError();

  const loader = elements.loadingIndicator;
  if (loader) {
    loader.removeAttribute('hidden');
    loader.style.display = 'flex';
    loader.setAttribute('aria-hidden', 'false');
  }

  const btn = elements.searchBtn;
  if (btn) {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
  }

  const input = elements.searchInput;
  if (input) {
    input.disabled = true;
  }
}

/**
 * Oculta el indicador de carga y reactiva los controles del formulario.
 */
export function hideLoading() {
  const loader = elements.loadingIndicator;
  if (loader) {
    loader.setAttribute('hidden', '');
    loader.style.display = 'none';
    loader.setAttribute('aria-hidden', 'true');
  }

  const btn = elements.searchBtn;
  if (btn) {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
  }

  const input = elements.searchInput;
  if (input) {
    input.disabled = false;
  }
}

/**
 * Muestra un mensaje de error accesible y visible en la interfaz.
 * @param {string} message - Descripción del error a mostrar.
 */
export function showError(message) {
  if (!elements.statusContainer) return;

  const safeMessage = escapeHtml(message);

  elements.statusContainer.innerHTML = `
    <div class="alert alert--error" role="alert" tabindex="-1">
      <svg class="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="alert__content">
        <p class="alert__title">Atención</p>
        <p class="alert__description">${safeMessage}</p>
      </div>
    </div>
  `;

  // Enfocar suavemente para accesibilidad de lectores de pantalla
  const alertEl = elements.statusContainer.querySelector('.alert');
  if (alertEl) {
    alertEl.focus();
  }
}

/**
 * Limpia cualquier mensaje de estado o error activo.
 */
export function clearError() {
  if (elements.statusContainer) {
    elements.statusContainer.innerHTML = '';
  }
}

/**
 * Limpia el contenido de la sección del clima.
 */
export function clearWeather() {
  if (elements.weatherSection) {
    elements.weatherSection.innerHTML = '';
  }
}

/**
 * Renderiza la tarjeta meteorológica con la información formateada y datos visuales.
 * @param {Object} weatherData - Datos meteorológicos devueltos por la API.
 * @param {Object} cityData - Datos geográficos de la ciudad encontrada.
 */
export function renderWeather(weatherData, cityData) {
  if (!elements.weatherSection) return;

  clearError();

  const condition = getWeatherCondition(weatherData.weathercode, weatherData.isDay);
  const roundedTemp = Math.round(weatherData.temperature);
  const preciseTemp = Number(weatherData.temperature).toFixed(1);
  const windSpeed = Number(weatherData.windspeed).toFixed(1);

  // Construcción del subtítulo de ubicación (Estado/Región y País)
  const locationDetails = [cityData.admin1, cityData.country]
    .filter(Boolean)
    .join(', ');

  // Formato amigable de la hora de la observación
  let formattedTime = 'Reciente';
  if (weatherData.time) {
    try {
      const dateObj = new Date(weatherData.time);
      formattedTime = dateObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      formattedTime = weatherData.time;
    }
  }

  const weatherCardHtml = `
    <article class="weather-card ${condition.theme}" aria-label="Información del clima para ${escapeHtml(cityData.name)}">
      <header class="weather-card__header">
        <div class="weather-card__location">
          <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div>
            <h2 class="weather-card__city">${escapeHtml(cityData.name)}</h2>
            ${locationDetails ? `<p class="weather-card__region">${escapeHtml(locationDetails)}</p>` : ''}
          </div>
        </div>
        <span class="weather-card__badge" title="Condición meteorológica">
          ${condition.description}
        </span>
      </header>

      <div class="weather-card__main">
        <div class="weather-card__visual">
          ${condition.icon}
        </div>
        <div class="weather-card__temperature-box">
          <div class="weather-card__temperature">
            <span class="temp-value">${roundedTemp}</span>
            <span class="temp-unit">°C</span>
          </div>
          <p class="weather-card__temp-precision">Precisión: ${preciseTemp}°C</p>
        </div>
      </div>

      <footer class="weather-card__details">
        <div class="detail-item" title="Velocidad del viento">
          <div class="detail-item__icon-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
            </svg>
          </div>
          <div class="detail-item__data">
            <span class="detail-item__label">Viento</span>
            <span class="detail-item__value">${windSpeed} <small>km/h</small></span>
          </div>
        </div>

        <div class="detail-item" title="Estado de luz diurna">
          <div class="detail-item__icon-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </div>
          <div class="detail-item__data">
            <span class="detail-item__label">Período</span>
            <span class="detail-item__value">${weatherData.isDay ? 'Diurno' : 'Nocturno'}</span>
          </div>
        </div>

        <div class="detail-item" title="Hora del reporte">
          <div class="detail-item__icon-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="detail-item__data">
            <span class="detail-item__label">Actualizado</span>
            <span class="detail-item__value">${formattedTime}</span>
          </div>
        </div>
      </footer>
    </article>
  `;

  elements.weatherSection.innerHTML = weatherCardHtml;
}
