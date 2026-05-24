// ---------- ИНИЦИАЛИЗАЦИЯ КАРТЫ ----------
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentCircle = null;
let currentButton = null;      // активная кнопка (DOM-элемент)

// ---------- ФУНКЦИЯ ПОДСВЕТКИ КНОПКИ ----------
function setActiveButton(button) {
    if (currentButton) {
        currentButton.classList.remove('active-button');
    }
    button.classList.add('active-button');
    currentButton = button;
}

// ---------- ФУНКЦИЯ РИСОВАНИЯ КРУГА ----------
function showContinent(lat, lon, radius, color = 'red') {
    if (currentCircle) map.removeLayer(currentCircle);
    currentCircle = L.circle([lat, lon], { radius, color }).addTo(map);
    map.setView([lat, lon], 4);
}

// ---------- ЗАПРОС К API С ОБРАБОТКОЙ ОШИБОК ----------
function fetchAndShow(continentName, radius = 1500000) {
    const url = `https://nominatim.openstreetmap.org/search?q=${continentName}&format=json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                showContinent(lat, lon, radius);
            } else {
                console.warn(`Координаты для ${continentName} не найдены`);
            }
        })
        .catch(error => {
            console.error(`Ошибка запроса для ${continentName}:`, error);
        });
}

// ---------- ОБРАБОТЧИК ДЛЯ КНОПКИ ----------
function onButtonClick(button, continentName) {
    setActiveButton(button);
    fetchAndShow(continentName);
}

// ---------- ИНИЦИАЛИЗАЦИЯ: НАХОДИМ ВСЕ КНОПКИ И НАЗНАЧАЕМ СОБЫТИЯ ----------
const buttons = document.querySelectorAll('#contacts .flex-row:last-child button');
let firstButton = null;   // для активации по умолчанию

buttons.forEach(button => {
    const continent = button.getAttribute('data-continent');
    if (!continent) return;

    if (continent === 'europe') {
        firstButton = button;   // запоминаем кнопку Европы
    }

    button.addEventListener('click', () => onButtonClick(button, continent));
});

// Если кнопка Европа найдена – активируем её и загружаем карту
if (firstButton) {
    onButtonClick(firstButton, firstButton.getAttribute('data-continent'));
} else {
    // fallback: активируем первую кнопку, если Европа не найдена
    if (buttons.length) {
        const fallbackContinent = buttons[0].getAttribute('data-continent');
        setActiveButton(buttons[0]);
        if (fallbackContinent) fetchAndShow(fallbackContinent);
    }
}