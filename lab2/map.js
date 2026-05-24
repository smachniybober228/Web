function showContinent(lat, lon, radius, color = "red") {
    if (currentCircle) {
        map.removeLayer(currentCircle);
    }
    currentCircle = L.circle([lat, lon], { radius: radius, color: color }).addTo(map);
    map.setView([lat, lon], 4); // приближаем к континенту
}

function fetchAndShow(continentName, radius = 1) {
    // 1. Формируем URL для запроса
    const url = `https://nominatim.openstreetmap.org/search?q=${continentName}&format=json`;

    // 2. Отправляем запрос
    fetch(url)
        .then(response => response.json())      // 3. Преобразуем ответ в JSON
        .then(data => {                         // 4. Получили массив с координатами
            const lat = data[0].lat;            // широта из ответа
            const lon = data[0].lon;            // долгота из ответа
        
            // 5. Рисуем окружность на карте
            showContinent(lat, lon, 1500000);    
        })
        .catch(error => {                       // 6. Обрабатываем ошибки
            console.log('API недоступно, использую запасные координаты');
        });
}

const map = L.map('map').setView([20, 0], 2);

let currentCircle = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const buttons = document.querySelectorAll("#contacts .flex-row:last-child button")
buttons[0].addEventListener("click", () => fetchAndShow("Europe"));
buttons[1].addEventListener("click", () => fetchAndShow("Asia"));
buttons[2].addEventListener("click", () => fetchAndShow("America"));
buttons[3].addEventListener("click", () => fetchAndShow("Africa"));