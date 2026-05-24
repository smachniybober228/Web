// ---------- НАСТРОЙКИ КОНТИНЕНТОВ ----------
const continentSettings = {
    europe:  { radius: 2000000, zoom: 4 },
    asia:    { radius: 3500000, zoom: 3 },
    america: { radius: 4000000, zoom: 3 },
    africa:  { radius: 3000000, zoom: 3 }
};

// ---------- ИНИЦИАЛИЗАЦИЯ КАРТЫ ----------
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentCircle = null;
let currentButton = null;

// ---------- ФУНКЦИЯ ПОДСВЕТКИ КНОПКИ ----------
function setActiveButton(button) {
    if (currentButton) currentButton.classList.remove('active-button');
    button.classList.add('active-button');
    currentButton = button;
}

// ---------- ФУНКЦИЯ РИСОВАНИЯ КРУГА ----------
function showContinent(lat, lon, radius = 1500000, zoom = 4, color = 'red') {
    if (currentCircle) map.removeLayer(currentCircle);
    currentCircle = L.circle([lat, lon], { radius, color }).addTo(map);
    map.setView([lat, lon], zoom);
}

// ---------- ЗАПРОС К API ----------
function fetchAndShow(continentName) {
    const settings = continentSettings[continentName];
    if (!settings) {
        console.error(`Нет настроек для континента ${continentName}`);
        return;
    }
    const { radius, zoom } = settings;
    const url = `https://nominatim.openstreetmap.org/search?q=${continentName}&format=json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                showContinent(lat, lon, radius, zoom);
            } else {
                console.warn(`Координаты для ${continentName} не найдены`);
            }
        })
        .catch(error => {
            console.error(`Ошибка запроса для ${continentName}:`, error);
        });
}

// ---------- ОБРАБОТЧИК КЛИКА ----------
function onButtonClick(button, continentName) {
    setActiveButton(button);
    fetchAndShow(continentName);
}

// ---------- ИНИЦИАЛИЗАЦИЯ КНОПОК ----------
const buttons = document.querySelectorAll('#contacts .flex-row:last-child button');
let firstButton = null;

buttons.forEach(button => {
    const continent = button.getAttribute('data-continent');
    if (!continent) return;
    if (continent === 'europe') firstButton = button;
    button.addEventListener('click', () => onButtonClick(button, continent));
});

// Активируем первую кнопку (Европа) и показываем её на карте
if (firstButton) {
    setActiveButton(firstButton);
    fetchAndShow('europe');
} else if (buttons.length) {
    // fallback: если кнопка europe не найдена, активируем первую
    const fallbackContinent = buttons[0].getAttribute('data-continent');
    setActiveButton(buttons[0]);
    if (fallbackContinent) fetchAndShow(fallbackContinent);
}