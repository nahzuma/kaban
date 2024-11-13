document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const columns = document.querySelectorAll('.column');

    // Load tasks from localStorage
    loadTasks();

    // Add task event listener
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            createTask(taskText, 'open');
            taskInput.value = '';
        }
    });

    // Create task function
    function createTask(text, columnId) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.draggable = true;

        // Task content container (for better styling control)
        const taskContent = document.createElement('span');
        taskContent.textContent = text;
        task.appendChild(taskContent);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => editTask(taskContent));
        task.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task));
        task.appendChild(deleteBtn);

        // Drag and drop events
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        // Append to the specific column
        const column = document.getElementById(columnId + 'Tasks');
        column.appendChild(task);

        // Save tasks to localStorage
        saveTasks();
    }

    // Edit task function
    function editTask(taskContent) {
        const newTaskText = prompt("Edite a tarefa:", taskContent.textContent);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskContent.textContent = newTaskText.trim();
            saveTasks();
        }
    }

    // Delete task function
    function deleteTask(task) {
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
            task.remove();
            saveTasks();
        }
    }

    // Drag and drop functionality
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.target.classList.add('dragging');
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    // Allow dropping
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            column.querySelector('.task-list').appendChild(draggingTask);
            saveTasks();
        });
    });

    // Save tasks to localStorage
    function saveTasks() {
        const columns = ['open', 'bid', 'inProgress', 'done'];
        const tasksData = {};

        columns.forEach(columnId => {
            const taskList = document.getElementById(columnId + 'Tasks');
            tasksData[columnId] = Array.from(taskList.children).map(task => task.querySelector('span').textContent);
        });

        localStorage.setItem('kanbanTasks', JSON.stringify(tasksData));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('kanbanTasks');
        if (savedTasks) {
            const tasksData = JSON.parse(savedTasks);
            Object.keys(tasksData).forEach(columnId => {
                tasksData[columnId].forEach(taskText => {
                    createTask(taskText, columnId);
                });
            });
        }
    }
});