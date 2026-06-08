"use strict";

// -------------------- Глобальные переменные --------------------
let tasks = [];               // Массив задач
let currentFilter = "all";    // Текущий фильтр: "all", "active", "completed"
let currentSort = "newest";   // Текущий способ сортировки: "A-Z", "Z-A", "newest", "oldest"

// -------------------- Инициализация данных --------------------
function initTasks() {
    const stored = localStorage.getItem("todoList");
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        // Задачи по умолчанию
        tasks = [
            { task: "Почесать кошку", date: "от 24.08.2023", completed: false },
            { task: "Полить картошку", date: "от 04.05.2022", completed: false },
            { task: "Сложить в лукошко", date: "от 14.05.2022", completed: false }
        ];
    }
}

function initSorting() {
    const savedSort = localStorage.getItem("todoSort");
    if (savedSort && ["A-Z", "Z-A", "newest", "oldest"].includes(savedSort)) {
        currentSort = savedSort;
    }
}

// -------------------- Работа с данными: фильтрация, сортировка, сохранение --------------------
function getFilteredTasks() {
    if (currentFilter === "active") return tasks.filter(t => !t.completed);
    if (currentFilter === "completed") return tasks.filter(t => t.completed);
    return tasks; // "all"
}

const saveTasksToStorage = () => localStorage.setItem("todoList", JSON.stringify(tasks));

// Парсит строку даты вида "от 24.08.2023" в объект Date
function parseDateFromString(dateStr) {
    const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!match) return new Date(0);
    const [_, day, month, year] = match;
    return new Date(`${year}-${month}-${day}T00:00:00`);
}

function sortTasks() {
    tasks.sort((a, b) => {
        if (currentSort === "A-Z") {
            return a.task.localeCompare(b.task, "ru");
        } else if (currentSort === "Z-A") {
            return b.task.localeCompare(a.task, "ru");
        } else if (currentSort === "newest") {
            const dateA = parseDateFromString(a.date);
            const dateB = parseDateFromString(b.date);
            return dateB - dateA; // Новые (большая дата) идут первыми
        } else if (currentSort === "oldest") {
            const dateA = parseDateFromString(a.date);
            const dateB = parseDateFromString(b.date);
            return dateA - dateB; // Старые (меньшая дата) идут первыми
        }
        return 0;
    });
}

function saveAndRender() {
    sortTasks();
    saveTasksToStorage();
    renderTodoList();
    updateFilterButtons();
}

// -------------------- Рендеринг списка --------------------
// Создаёт DOM-элемент для одной задачи
function createTaskElement(task) {
    const li = document.createElement("li");
    
    const label = document.createElement("label");
    label.className = "MyLabel";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "CustomCheckbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("click", () => {
        task.completed = !task.completed;
        saveAndRender();
    });
    
    const checkmark = document.createElement("span");
    checkmark.className = "Checkmark";
    
    const allText = document.createElement("span");
    allText.className = "AllText";
    
    const taskText = document.createElement("span");
    taskText.className = "TaskText";
    taskText.textContent = task.task;
    
    const subText = document.createElement("sub");
    subText.className = "SubTaskText";
    subText.textContent = task.date;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "MyButton";
    deleteBtn.textContent = "✖";
    deleteBtn.addEventListener("click", () => {
        const index = tasks.indexOf(task);
        if (index !== -1) tasks.splice(index, 1);
        saveAndRender();
    });
    
    // Сборка структуры
    allText.appendChild(taskText);
    allText.appendChild(subText);
    label.appendChild(checkbox);
    label.appendChild(checkmark);
    label.appendChild(allText);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    
    return li;
}

// Перерисовывает весь список с учётом фильтрации
function renderTodoList() {
    const todoList = document.getElementById("TodoList");
    todoList.innerHTML = "";
    const filteredTasks = getFilteredTasks();
    filteredTasks.forEach(task => {
        todoList.appendChild(createTaskElement(task));
    });
}

// -------------------- Обновление кнопок фильтра (счётчики, активная кнопка) --------------------
function updateFilterButtons() {
    const allCount = tasks.length;
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    const allBtn = document.querySelector(".filter-btn[data-filter=\"all\"]");
    const activeBtn = document.querySelector(".filter-btn[data-filter=\"active\"]");
    const completedBtn = document.querySelector(".filter-btn[data-filter=\"completed\"]");
    
    if (allBtn) allBtn.textContent = `Все (${allCount})`;
    if (activeBtn) activeBtn.textContent = `Активные (${activeCount})`;
    if (completedBtn) completedBtn.textContent = `Выполненные (${completedCount})`;
}

// Устанавливает активный класс на кнопку фильтра и перемещает блок сортировки
function setActiveFilterButton() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        if (btn.getAttribute("data-filter") === currentFilter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    moveSortContainerToActiveFilter();
}

// Перемещает #sort-container внутрь контейнера активной кнопки фильтра
function moveSortContainerToActiveFilter() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const sortContainer = document.getElementById("sort-container");
    if (!activeBtn || !sortContainer) return;
    
    const activeContainer = activeBtn.closest(".filter-btn-container");
    if (!activeContainer) return;
    
    // Если сортировка уже на месте – ничего не делаем
    if (sortContainer.parentNode === activeContainer && activeContainer.lastElementChild === sortContainer) {
        return;
    }
    
    activeContainer.appendChild(sortContainer);
}

// -------------------- Обработчики событий --------------------
function setupFilterButtons() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.getAttribute("data-filter");
            renderTodoList();
            setActiveFilterButton();
        });
    });
    updateFilterButtons();
    setActiveFilterButton();
}

function setupSorting() {
    const btn = document.getElementById("sort-btn");
    const sortingOptions = document.getElementById("sorting-options");
    
    // Изначально скрыто
    sortingOptions.style.display = "none";
    
    // Открытие/закрытие меню по кнопке
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        sortingOptions.style.display = (sortingOptions.style.display === "none") ? "flex" : "none";
    });
    
    // Закрытие при клике вне меню
    document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !sortingOptions.contains(e.target)) {
            sortingOptions.style.display = "none";
        }
    });
    
    // Обработка выбора пункта сортировки
    document.querySelectorAll("#sorting-options a").forEach(link => {
        link.addEventListener("click", () => {
            const sortDirection = link.getAttribute("data-sort");
            if (currentSort !== sortDirection) {
                currentSort = sortDirection;
                localStorage.setItem("todoSort", currentSort);
                saveAndRender();
            }
            sortingOptions.style.display = "none";
        });
    });
}

// -------------------- Работа с полем ввода и кнопками создания/очистки --------------------
const textField = document.getElementById("NewElementName");
const clearTextField = () => textField.value = "";

const clearBtn = document.getElementById("clearButton");
clearBtn.addEventListener("click", clearTextField);

const createBtn = document.getElementById("createButton");
createBtn.addEventListener("click", () => {
    if (textField.value === "") return;
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
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

// -------------------- Запуск приложения --------------------
initTasks();
initSorting();
setupFilterButtons();
setupSorting();
saveAndRender();