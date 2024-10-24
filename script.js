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

// Save list as .txt or .xlsx
function saveList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const selectedFormat = prompt("Enter 'excel' to download as Excel or 'text' to download as a text file:");

    if (selectedFormat && selectedFormat.toLowerCase() === 'text') {
        const textContent = tasks.map(task => `${task.text} - ${task.date} - ${task.completed ? 'Completed' : 'Pending'}`).join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${document.getElementById('list-name').textContent}.txt`;
        link.click();
    } else if (selectedFormat && selectedFormat.toLowerCase() === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(tasks.map(task => ({
            Task: task.text,
            Date: task.date,
            Status: task.completed ? 'Completed' : 'Pending'
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        XLSX.writeFile(workbook, `${document.getElementById('list-name').textContent}.xlsx`);
    } else {
        alert("Invalid format selected. Please enter 'excel' or 'text'.");
    }
}
