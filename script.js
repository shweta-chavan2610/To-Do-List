const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const submitBtn = document.getElementById("submit-btn");
const STORAGE_KEY = "todo-tasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editingId = null;

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();

  tasks.forEach(task => {
    const li = document.createElement("li");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.completed;
    check.setAttribute("aria-label", "Mark task completed");
    check.addEventListener("change", () => {
      task.completed = check.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.className = "task-text" +
      (task.completed ? " completed" : "");
    span.textContent = task.text;

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "edit";
    edit.addEventListener("click", () => {
      input.value = task.text;
      editingId = task.id;
      submitBtn.textContent = "Save";
      input.focus();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete";
    del.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      if (editingId === task.id) resetForm();
      saveTasks();
      renderTasks();
    });

    li.append(check, span, edit, del);
    list.appendChild(li);
  });
}

function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add";
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  if (editingId !== null) {
    const task = tasks.find(item => item.id === editingId);
    if (task) task.text = text;
  } else {
    tasks.push({
      id: Date.now().toString() + Math.random(),
      text,
      completed: false
    });
  }

  saveTasks();
  resetForm();
  renderTasks();
});

renderTasks();