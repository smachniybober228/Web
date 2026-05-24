function changeActiveButton(newIndex) {
    if (newIndex !== btnIndex) {
        const oldBtn = document.querySelector(`#contacts .flex-row:last-child button:nth-of-type(${btnIndex})`);
        const newBtn = document.querySelector(`#contacts .flex-row:last-child button:nth-of-type(${newIndex})`);
        oldBtn.classList.remove('active-button');
        newBtn.classList.add('active-button');
        btnIndex = newIndex;
    }
}

function btnFunc(newIndex, continentName){
    changeActiveButton(newIndex);
    fetchAndShow(continentName);
}

function showContinent(lat, lon, radius, color = "red") {
    if (currentCircle) {
        map.removeLayer(currentCircle);
    }
    currentCircle = L.circle([lat, lon], { radius: radius, color: color }).addTo(map);
    map.setView([lat, lon], 4); // приближаем к континенту
}

function fetchAndShow(continentName, radius = 1500000) {
    // 1. Формируем URL для запроса
    const url = `https://nominatim.openstreetmap.org/search?q=${continentName}&format=json`;

    // 2. Отправляем запрос
    fetch(url)
        .then(response => response.json())      // 3. Преобразуем ответ в JSON
        .then(data => {                         // 4. Получили массив с координатами
            const lat = data[0].lat;            // широта из ответа
            const lon = data[0].lon;            // долгота из ответа
        
            // 5. Рисуем окружность на карте
            showContinent(lat, lon, radius);    
        })
        .catch(error => {                       // 6. Обрабатываем ошибки
            console.log('API недоступно, использую запасные координаты');
        });
}

const map = L.map('map').setView([20, 0], 2);

let currentCircle = null;
let btnIndex = 1; // Индекс активной кнопки

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const buttons = document.querySelectorAll("#contacts .flex-row:last-child button")
buttons[0].addEventListener("click", () => btnFunc(1, "Europe"));
buttons[1].addEventListener("click", () => btnFunc(2, "Asia"));
buttons[2].addEventListener("click", () => btnFunc(3, "America"));
buttons[3].addEventListener("click", () => btnFunc(4, "Africa"));

fetchAndShow("Europe");