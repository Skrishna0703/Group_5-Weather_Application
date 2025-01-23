const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherinfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const recentSearchContainer = document.querySelector('.recent-search-container');
const countrytxtSection = document.querySelector('.country-txt');
const temptxtSection = document.querySelector('.temp-txt');
const conditiontxtSection = document.querySelector('.condition-txt');
const humidityvaluetxtSection = document.querySelector('.humidity-value-txt');
const windvaluetxtSection = document.querySelector('.wind-value-txt');
const weathersummaryimgSection = document.querySelector('.weather-summary-img');
const currentdatetxtSection = document.querySelector('.current-date-txt');
const searchcitySection = document.querySelector('.search-city');

const apikey = 'f6c3bb91052b9f8d79aefcc5c7efabbf';
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Search button click event
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
    }
});

// Enter key press event
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
    }
});

// Fetch weather data
async function getFetchData(endpoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiurl);
    return response.json();
}

// Get weather icon
function getweatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    return 'clouds.svg';
}

// Update weather information
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod !== 200) {
        showSection(notFoundSection);
        return;
    }
    const { name, main: { temp, humidity }, weather: [{ id, main }], wind: { speed } } = weatherData;

    countrytxtSection.textContent = name;
    temptxtSection.textContent = `${Math.round(temp)}°C`;
    conditiontxtSection.textContent = main;
    humidityvaluetxtSection.textContent = `${humidity}%`;
    windvaluetxtSection.textContent = `${speed} M/s`;
    weathersummaryimgSection.src = `/assets/weather/${getweatherIcon(id)}`;
    currentdatetxtSection.textContent = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short'
    });

    showSection(weatherinfoSection);
    addRecentSearch(city);
    updateRecentSearchUI();
}

// Show specified section
function showSection(section) {
    [weatherinfoSection,searchcitySection, notFoundSection].forEach(s => s.style.display = 'none');
    section.style.display = 'flex';
}

// Add city to recent searches
function addRecentSearch(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        if (recentCities.length > 3) recentCities.pop();
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
}

// Update recent search UI
async function updateRecentSearchUI() {
    recentSearchContainer.innerHTML = '';
    for (const city of recentCities) {
        const weatherData = await getFetchData('weather', city);
        const cityElement = document.createElement('div');
        cityElement.classList.add('recent-city');

        if (weatherData.cod === 200) {
            const { main: { temp }, weather: [{ id }] } = weatherData;
            cityElement.innerHTML = `
                <img src="/assets/weather/${getweatherIcon(id)}" alt="Weather Icon">
                <h5>${city}</h5>
                <p>${Math.round(temp)}°C</p>
            `;
        } else {
            cityElement.innerHTML = `<h5>${city}</h5><p>Data Unavailable</p>`;
        }

        cityElement.addEventListener('click', () => updateWeatherInfo(city));
        recentSearchContainer.appendChild(cityElement);
    }
}

// Load recent searches on page load
updateRecentSearchUI();
document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.getElementById('info-icon');
    
    // Check if the element is correctly selected
    console.log(infoIcon); // Should log the image element

    if (infoIcon) {
        infoIcon.addEventListener('click', function() {
            console.log('Info icon clicked'); // Debugging: log click event
            window.location.href = 'member.html';  // Redirect to member.html
        });
    }
});