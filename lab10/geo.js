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
			}, (error) =>
                reject(error)
            );
		} else
            reject('Геолокация не поддерживается этим браузером.');
	});
}

function changeCity(coords){
    const citySpan = document.getElementById("city-name");
    if (!citySpan) return;

    citySpan.textContent = `lat: ${coords.lat}; lon: ${coords.lon}`;
}

getCurrentGeolocation()
    .then(coords => changeCity(coords))
    .catch(err => 
    {
        if (err.code === 1){
            console.log("Доступ к геолокации запрещён.");
        }
        else if (err.code === 2){
            console.log("Не удалось определить ваше местоположение.");
        }
        else if (err.code === 3) {
            console.log("Время ожидания истекло.");
        }
        console.log("Использован город по умолчанию.")

        const lat = DefaultLat;
        const lon = DefaultLon;
        changeCity({lat, lon});
    }
)