let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'
let currentSort = "A-Z" // 'A-Z', 'Z-A'

function initTasks() {
    const stored = localStorage.getItem("todoList");
    if (stored) {
        tasks = JSON.parse(stored);
    }
    else {
        // Задачи по умолчанию
        tasks = [
            { task: "Почесать кошку", date: "24.08.2023", completed: false },
            { task: "Полить картошку", date: "04.05.2022", completed: false },
            { task: "Сложить в лукошко", date: "14.05.2022", completed: false }
        ];
        saveTasksToStorage();
    }
    renderTodoList();
}

function initSorting() {
    const savedSort = localStorage.getItem('todoSort');
    if (savedSort && (savedSort === 'A-Z' || savedSort === 'Z-A')) {
        currentSort = savedSort;
    }
    sortTasks();
}

// Фильтрует задачи по текущему фильтру
function getFilteredTasks() {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks; // 'all'
}

const saveTasksToStorage = () => localStorage.setItem('todoList', JSON.stringify(tasks));

// Перерисовка списка
function renderTodoList() {
    const todoList = document.getElementById('TodoList');
    todoList.innerHTML = '';
    const filteredTasks = getFilteredTasks();
    filteredTasks.forEach((task, _) => {
        const li = createTaskElement(task); // создаём DOM-элемент задачи
        todoList.appendChild(li);
    });
}

function createTaskElement(task) {
    // Создаём элементы
    const li = document.createElement('li');
    
    const label = document.createElement('label');
    label.className = 'MyLabel';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'CustomCheckbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener("click", function() {
        task.completed = !task.completed;
        saveAndRender();
    });
    
    const checkmark = document.createElement('span');
    checkmark.className = 'Checkmark';
    
    const allText = document.createElement('span');
    allText.className = 'AllText';
    
    const taskText = document.createElement('span');
    taskText.className = 'TaskText';
    taskText.textContent = task.task;
    
    const subText = document.createElement('sub');
    subText.className = 'SubTaskText';
    subText.textContent = task.date;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'MyButton';
    deleteBtn.textContent = '✖';
    deleteBtn.addEventListener("click", function() {
        const index = tasks.indexOf(task);
        if (index !== -1) tasks.splice(index, 1);
        saveAndRender();
    });
    
    // Собираем вложенность
    allText.appendChild(taskText);
    allText.appendChild(subText);
    label.appendChild(checkbox);
    label.appendChild(checkmark);
    label.appendChild(allText);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    return li;
}

const textField = document.getElementById("NewElementName");

const clearTextField = () => textField.value = "";

const clearBtn = document.getElementById("clearButton");
clearBtn.addEventListener("click", clearTextField);

const createBtn = document.getElementById("createButton");
createBtn.addEventListener("click", function() {
    if (textField.value === "") return;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const todayFrmt = `от ${day}.${month}.${year}`;

    tasks.push({
        task: textField.value,
        date: todayFrmt,
        completed: false
    });
    saveAndRender();

    clearTextField();
});

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            renderTodoList();                // перерисовываем список
            setActiveFilterButton();          // обновляем активную кнопку и перемещаем сортировку
        });
    });
    updateFilterButtons();                   // обновляем текст кнопок (счётчики)
    setActiveFilterButton();                 // инициализация активной кнопки и позиции сортировки
}

function setupSorting() {
    const btn = document.getElementById("sort-btn");
    const sortingOptions = document.getElementById('sorting-options');

    // Изначально скрываем блок с опциями
    sortingOptions.style.display = 'none';

    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы клик не всплывал и не закрывал меню сразу
        if (sortingOptions.style.display === 'none') {
            sortingOptions.style.display = 'flex'; // или 'block', но у вас flex
        } else {
            sortingOptions.style.display = 'none';
        }
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !sortingOptions.contains(e.target)) {
            sortingOptions.style.display = 'none';
        }
    });
    
    // Скрываем после выбора пункта
    document.querySelectorAll('#sorting-options a').forEach(link => {
        link.addEventListener('click', () => {
            const sortDirection = link.getAttribute("data-sort");
            if (currentSort !== sortDirection) {
                currentSort = sortDirection;
                localStorage.setItem("todoSort", currentSort);
                saveAndRender();
            }
            sortingOptions.style.display = 'none';
        });
    });
}

function sortTasks() {
    tasks.sort((a, b) => {
        const comparison = a.task.localeCompare(b.task, 'ru');
        return currentSort === 'A-Z' ? comparison : -comparison;
    });
}

function updateFilterButtons() {
    const allCount = tasks.length;
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    const activeBtn = document.querySelector('.filter-btn[data-filter="active"]');
    const completedBtn = document.querySelector('.filter-btn[data-filter="completed"]');

    if (allBtn) allBtn.textContent = `Все (${allCount})`;
    if (activeBtn) activeBtn.textContent = `Активные (${activeCount})`;
    if (completedBtn) completedBtn.textContent = `Выполненные (${completedCount})`;
}

// Устанавливает активный класс на кнопку фильтра и перемещает блок сортировки
function setActiveFilterButton() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    moveSortContainerToActiveFilter();
}

// Перемещает #sort-container внутрь .filter-buttons и ставит после активной кнопки
function moveSortContainerToActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const sortContainer = document.getElementById('sort-container');
    if (!activeBtn || !sortContainer) return;

    // Находим контейнер .filter-btn-container, в котором находится активная ссылка
    const activeContainer = activeBtn.closest('.filter-btn-container');
    if (!activeContainer) return;

    // Если сортировка уже внутри этого контейнера и стоит на правильном месте – ничего не делаем
    if (sortContainer.parentNode === activeContainer && activeContainer.lastElementChild === sortContainer) {
        return;
    }

    // Перемещаем sortContainer в конец активного контейнера
    activeContainer.appendChild(sortContainer);
}

function saveAndRender() {
    sortTasks();
    saveTasksToStorage();
    renderTodoList();
    updateFilterButtons();
}

initTasks();
initSorting();
setupFilterButtons();
setupSorting();