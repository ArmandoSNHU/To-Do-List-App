document.addEventListener('DOMContentLoaded', () => {
    loadListName();
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskDateInput = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() === "" || taskDateInput.value.trim() === "") {
        alert("Please enter both a task and a date/time.");
        return;
    }

    const taskItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.className = "task-text";
    taskText.textContent = taskInput.value;

    const timestamp = document.createElement('span');
    timestamp.className = "timestamp";
    timestamp.textContent = new Date(taskDateInput.value).toLocaleString();

    taskItem.appendChild(taskText);
    taskItem.appendChild(timestamp);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        taskList.removeChild(taskItem);
        saveTasks();
    };
    taskItem.appendChild(deleteButton);

    taskItem.onclick = () => {
        taskItem.classList.toggle('completed');
        saveTasks();
    };

    taskList.appendChild(taskItem);
    taskInput.value = "";
    taskDateInput.value = "";
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(taskItem => {
        tasks.push({
            text: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.classList.contains('completed'),
            date: taskItem.querySelector('.timestamp').textContent
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');

    savedTasks.forEach(task => {
        const taskItem = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const timestamp = document.createElement('span');
        timestamp.className = "timestamp";
        timestamp.textContent = task.date;

        if (task.completed) taskItem.classList.add('completed');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            taskList.removeChild(taskItem);
            saveTasks();
        };

        taskItem.appendChild(taskText);
        taskItem.appendChild(timestamp);
        taskItem.appendChild(deleteButton);

        taskItem.onclick = () => {
            taskItem.classList.toggle('completed');
            saveTasks();
        };

        taskList.appendChild(taskItem);
    });
}

function renameList() {
    const listNameInput = document.getElementById('list-name-input');
    const listName = document.getElementById('list-name');
    if (listNameInput.value.trim() !== "") {
        listName.textContent = listNameInput.value;
        localStorage.setItem('listName', listNameInput.value);
        listNameInput.value = "";
    }
}

function loadListName() {
    const savedListName = localStorage.getItem('listName');
    if (savedListName) {
        document.getElementById('list-name').textContent = savedListName;
    }
}

// Function to show the New List confirmation popup
function showNewListConfirmation() {
    document.getElementById('new-list-popup').style.display = 'flex';
}

// Function to close the popup
function closePopup() {
    document.getElementById('new-list-popup').style.display = 'none';
}

// Function to create a new list
function createNewList() {
    localStorage.removeItem('tasks'); // Clear tasks from local storage
    localStorage.removeItem('listName'); // Clear the list name from local storage
    location.reload(); // Refresh the page to show a new list
}
