// Moscow coords
const DefaultLat = 55.7522;
const DefaultLon = 37.6156;

function getCurrentGeolocation()
{
	return new Promise((resolve, reject) =>
	{
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(
                (position) =>
			{
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				resolve({lat, lon});
			}, (error) => {
                // test
                // const lat = 55.01
				// const lon = 82.55
                // resolve({lat, lon})
                reject(error)
            }
            );
		} else
            reject('Геолокация не поддерживается этим браузером.');
	});
}

function changeCity(text){
    const citySpan = document.getElementById("city-name");
    if (citySpan) citySpan.textContent = text;
}

function showTemperature(temp){
    const tempSpan = document.getElementById("temperature");
    if (tempSpan) tempSpan.textContent = `${temp} °C`;
}

async function getCityByCoords(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`;
    const response = await fetch(url);
    const data = await response.json();
    const addr = data.address;

    let cityName = addr.city || addr.town || addr.village || addr.state || 'Неизвестное место';
    if ((addr.village || addr.hamlet) && !addr.city && !addr.town) {
        cityName = `${addr.village || addr.hamlet} (${addr.state || addr.region || addr.country})`;
    }
    return cityName;
}

async function getCurrentTemp(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    // Получаем текущее время (в часовом поясе пользователя)
    const now = new Date();
    // Приводим к формату ISO без минут и секунд (например, "2025-06-01T15:00")
    const currentHour = now.toISOString().slice(0, 13) + ':00';
    const index = data.hourly.time.indexOf(currentHour);
    if (index !== -1) return data.hourly.temperature_2m[index];
    else return data.hourly.temperature_2m[0];
}

async function getWeeklyForecast(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    const response = await fetch(url);
    const data = await response.json();
    return data.daily.time.map((date, i) => ({
        date: new Date(date),
        max: data.daily.temperature_2m_max[i],
        min: data.daily.temperature_2m_min[i]
    }));
}

// --- Карусель (один элемент, точки, стрелки) ---
let weekDays = [];
let currentIndex = 0;

function renderCurrentDay() {
    const slideDiv = document.getElementById('week-slide');
    if (!slideDiv || weekDays.length === 0) return;
    const day = weekDays[currentIndex];
    const dayName = day.date.toLocaleDateString('ru-RU', { weekday: 'long' });
    const dateStr = day.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    slideDiv.innerHTML = `
        <div class="carousel-card">
            <div class="day">${dayName}<br><small>${dateStr}</small></div>
            <div class="temp">Макс: ${Math.round(day.max)}°C / Мин: ${Math.round(day.min)}°C</div>
        </div>
    `;
}

function updateDots() {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    weekDays.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (idx === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = idx;
            renderCurrentDay();
            updateDots();
        });
        dotsContainer.appendChild(dot);
    });
}

function nextDay() {
    if (weekDays.length === 0) return;
    currentIndex = (currentIndex + 1) % weekDays.length;
    renderCurrentDay();
    updateDots();
}

function prevDay() {
    if (weekDays.length === 0) return;
    currentIndex = (currentIndex - 1 + weekDays.length) % weekDays.length;
    renderCurrentDay();
    updateDots();
}

function setupCarousel() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', prevDay);
    if (nextBtn) nextBtn.addEventListener('click', nextDay);
}

getCurrentGeolocation()
    .then(async coords => {
        const city = await getCityByCoords(coords.lat, coords.lon);
        changeCity(city);
        const currentTemp = await getCurrentTemp(lat, lon);
        showTemperature(currentTemp);
        weekDays = await getWeeklyForecast(lat, lon);
        renderCurrentDay();
        updateDots();
        setupCarousel();
    })
    .catch(async err => 
    {
        if (err === "Геолокация не поддерживается этим браузером."){
            console.log(err);
        }
        else if (err.code === 1){
            console.log("Доступ к геолокации запрещён.");
        }
        else if (err.code === 2){
            console.log("Не удалось определить ваше местоположение.");
        }
        else if (err.code === 3) {
            console.log("Время ожидания истекло.");
        }
        console.log("Использован город по умолчанию.")

        const city = await getCityByCoords(DefaultLat, DefaultLon);
        changeCity(city);
        const currentTemp = await getCurrentTemp(DefaultLat, DefaultLon);
        showTemperature(currentTemp);
        weekDays = await getWeeklyForecast(DefaultLat, DefaultLon);
        renderCurrentDay();
        updateDots();
        setupCarousel();
    }
)