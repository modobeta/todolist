let tasks = [];

function loadTasks() {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function addTask(title, description) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  const task = {
    id: generateId(),
    title: trimmedTitle,
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function editTask(id, newTitle, newDescription) {
  const trimmedTitle = newTitle.trim();
  if (!trimmedTitle) return;

  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  task.title = trimmedTitle;
  task.description = newDescription.trim();
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  renderTasks();
}

function createTaskElement(task) {
  const article = document.createElement('article');
  article.className = 'task-item';
  if (task.completed) article.classList.add('completed');
  article.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;

  const content = document.createElement('div');
  content.className = 'task-content';

  const titleSpan = document.createElement('span');
  titleSpan.className = 'task-title';
  titleSpan.textContent = task.title;

  const descSpan = document.createElement('span');
  descSpan.className = 'task-desc';
  descSpan.textContent = task.description;

  content.appendChild(titleSpan);
  content.appendChild(descSpan);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  article.appendChild(checkbox);
  article.appendChild(content);
  article.appendChild(actions);

  return article;
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  var sorted = tasks.slice().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  sorted.forEach(function (task) {
    list.appendChild(createTaskElement(task));
  });

  var hasCompleted = tasks.some(function (t) { return t.completed; });
  var existingBtn = document.querySelector('.clear-btn');
  if (hasCompleted && !existingBtn) {
    var btn = document.createElement('button');
    btn.className = 'clear-btn';
    btn.textContent = 'Limpiar completadas';
    btn.addEventListener('click', clearCompleted);
    list.parentNode.appendChild(btn);
  } else if (!hasCompleted && existingBtn) {
    existingBtn.remove();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  var titleInput = document.getElementById('taskTitle');
  var descInput = document.getElementById('taskDescription');
  addTask(titleInput.value, descInput.value);
  titleInput.value = '';
  descInput.value = '';
  titleInput.focus();
}

function handleListClick(e) {
  var article = e.target.closest('.task-item');
  if (!article) return;
  var id = article.dataset.id;

  if (e.target.classList.contains('task-checkbox')) {
    toggleTask(id);
    return;
  }

  if (e.target.textContent === 'Eliminar') {
    deleteTask(id);
    return;
  }

  if (e.target.textContent === 'Editar') {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    var newTitle = prompt('Editar t\u00edtulo:', task.title);
    if (newTitle === null) return;

    var newDesc = prompt('Editar descripci\u00f3n:', task.description);
    if (newDesc === null) return;

    editTask(id, newTitle, newDesc);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  tasks = loadTasks();
  renderTasks();

  document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('taskList').addEventListener('click', handleListClick);
});
