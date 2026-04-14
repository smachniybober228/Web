// ---------- СПИСКИ СТРАН ПО КОНТИНЕНТАМ ----------
const europe = [
    "france", "germany", "spain", "portugal", "italy", "sicily", "sardinia", "corsica",
    "netherlands", "belgium", "switzerland", "austria", "czech", "slovakia", "hungary",
    "poland", "ukraine", "belarus", "lithuania", "latvia", "estonia", "finland", "sweden",
    "norway", "denmark", "britain", "ireland", "ulster", "iceland", "greece", "crete",
    "cyprus", "malta", "turkey", "bulgaria", "romania", "moldova", "serbia", "croatia",
    "bosnia", "montenegro", "albania", "macedonia", "slovenia", "georgia", "armenia",
    "azerbaijan"
];

const asia = [
    "china", "mongolia", "japan", "hokkaido", "honshu", "kyushu", "shikoku",
    "south korea", "north korea", "taiwan", "india", "pakistan", "nepal", "bhutan",
    "bangladesh", "sri lanka", "burma", "thailand", "cambodia", "laos", "vietnam",
    "malaysia", "sumatra", "java", "kalimantan", "sulawesi", "papua new guinea",
    "philippines", "luzon", "mindoro", "negros", "cebu", "samar", "palawan",
    "indonesia", "timor", "kazakhstan", "uzbekistan", "turkmenistan", "kyrgyzstan",
    "tajikistan", "afghanistan", "iran", "iraq", "kuwait", "saudi", "yemen", "oman",
    "emirates", "qatar", "jordan", "syria", "lebanon", "israel"
];

const america = [
    "usa", "canada", "mexico", "greenland", "guatemala", "honduras", "el salvador",
    "nicaragua", "costa rica", "panama", "cuba", "jamaica", "haiti", "dominican republic",
    "puerto rico", "colombia", "venezuela", "guyana", "suriname", "guyane", "ecuador",
    "peru", "bolivia", "brazil", "paraguay", "uruguay", "argentina", "chile",
    "falklands", "tierra del fuego argentina", "tierra del fuego chile"
];

const africa = [
    "morocco", "algeria", "tunisia", "libya", "egypt", "mauritania", "senegal",
    "gambia", "guinea", "sierra leone", "liberia", "ivory coast", "ghana", "togo",
    "benin", "nigeria", "cameroon", "central african republic", "chad", "sudan",
    "south sudan", "eritrea", "djibouti", "ethiopia", "somalia", "kenya", "uganda",
    "rwanda", "burundi", "tanzania", "mozambique", "malawi", "zambia", "zimbabwe",
    "botswana", "namibia", "south africa", "lesotho", "swaziland", "madagascar",
    "angola", "congo", "drc", "gabon", "equatorial guinea", "sao tome", "principe",
    "bioko", "cabinda", "mauritius", "reunion", "comoros", "seychelles"
];

// ---------- ЗАГРУЗКА SVG ЧЕРЕЗ FETCH ----------
const mapContainer = document.getElementById('map-container');
let svgDoc = null; // здесь будет корневой элемент <svg>

function highlightContinent(countryIds) {
    if (!svgDoc) return;
    const allPaths = svgDoc.querySelectorAll('path');
    allPaths.forEach(path => {
        // Сброс
        if (path.dataset.originalFill !== undefined) {
            if (path.dataset.originalFill === 'null') path.removeAttribute('fill');
            else path.setAttribute('fill', path.dataset.originalFill);
            if (path.dataset.originalStroke === 'null') path.removeAttribute('stroke');
            else path.setAttribute('stroke', path.dataset.originalStroke);
            path.removeAttribute('stroke-width');
        }
    });
    countryIds.forEach(id => {
        const path = svgDoc.getElementById(id);
        if (path) {
            if (path.dataset.originalFill === undefined) {
                path.dataset.originalFill = path.getAttribute('fill') === null ? 'null' : path.getAttribute('fill');
                path.dataset.originalStroke = path.getAttribute('stroke') === null ? 'null' : path.getAttribute('stroke');
            }
            path.setAttribute('fill', 'rgba(255, 0, 0, 0.2)');
            path.setAttribute('stroke', 'red');
            path.setAttribute('stroke-width', '3');
        }
    });
}

// Загружаем SVG
fetch('../resources/Map.svg') // путь может быть относительным к HTML
    .then(response => {
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        return response.text();
    })
    .then(svgText => {
        mapContainer.innerHTML = svgText;
        const svgElement = mapContainer.querySelector('svg');
        if (!svgElement) throw new Error('В загруженном файле нет <svg>');
        svgDoc = svgElement;
        // Установим атрибуты ширины/высоты, если нужно
        svgDoc.setAttribute('width', '500');
        svgDoc.setAttribute('height', '420');
        console.log('SVG успешно загружен через fetch');
        
        // Назначаем обработчики кнопок (один раз)
        const btnEurope = document.querySelector('#contacts button:nth-of-type(1)');
        const btnAsia = document.querySelector('#contacts button:nth-of-type(2)');
        const btnAmerica = document.querySelector('#contacts button:nth-of-type(3)');
        const btnAfrica = document.querySelector('#contacts button:nth-of-type(4)');
        if (btnEurope) btnEurope.addEventListener('click', () => highlightContinent(europe));
        if (btnAsia) btnAsia.addEventListener('click', () => highlightContinent(asia));
        if (btnAmerica) btnAmerica.addEventListener('click', () => highlightContinent(america));
        if (btnAfrica) btnAfrica.addEventListener('click', () => highlightContinent(africa));
    })
    .catch(err => console.error('Ошибка загрузки SVG:', err));