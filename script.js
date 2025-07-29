const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop form from reloading the page
  const task = input.value.trim();
  if (task !== "") {
    addTask(task);
    input.value = ""; // clear input
    saveTasks(); // update localStorage
  }
});

function addTask(taskText, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  span.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.className = "edit-input";

    li.replaceChild(input, span);
    input.focus();

    function saveEdit() {
        const newText = input.value.trim();
        if (newText != "") {
            span.textContent = newText;
            li.replaceChild(span, input);
            saveTasks();
        }
    }

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur();
        }
    })
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  const btns = document.createElement("div");
  btns.classList.add("task-buttons");
  btns.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(btns);
  list.appendChild(li);
}

function saveTasks() {
  const tasks = [];
  list.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTask(task.text, task.completed));
}

loadTasks(); // load tasks on page load
