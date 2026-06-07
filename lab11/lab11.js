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
    console.log(todayFrmt);

    todoList = document.getElementById("TodoList");
    todoList.innerHTML += `
        <li>
            <label class="MyLabel">
                <input type="checkbox" class="CustomCheckbox">
                <span class="Checkmark"></span>
                <span class="AllText">
                <span class="TaskText">${textField.value}</span>
                <sub class="SubTaskText">${todayFrmt}</sub>
                </span>
            </label>
            <button class="MyButton">✖</button>
        </li>
    `;

    clearTextField();
});