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

async function getWeatherByCoords(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    // Получаем текущее время (в часовом поясе пользователя)
    const now = new Date();
    // Приводим к формату ISO без минут и секунд (например, "2025-06-01T15:00")
    const currentHour = now.toISOString().slice(0, 13) + ':00';
    const hourlyTimes = data.hourly.time;
    const index = hourlyTimes.indexOf(currentHour);
    if (index !== -1) {
        const temp = data.hourly.temperature_2m[index];
        return temp;
    } else {
        // Если точное совпадение не найдено, берём ближайший час
        return data.hourly.temperature_2m[0];
    }
}

getCurrentGeolocation()
    .then(async coords => {
        const city = await getCityByCoords(coords.lat, coords.lon);
        changeCity(city);
        const temp = await getWeatherByCoords(coords.lat, coords.lon)
        showTemperature(temp);
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
        const temp = await getWeatherByCoords(DefaultLat, DefaultLon)
        showTemperature(temp);
    }
)