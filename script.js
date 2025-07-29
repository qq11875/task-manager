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
  if (completed) {
    li.classList.add("completed");
  }

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

  const completeBtn = document.createElement("button")
  completeBtn.textContent = "Complete";
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });


  const btns = document.createElement("div");
  btns.classList.add("task-buttons");
  btns.appendChild(delBtn);
  btns.appendChild(completeBtn);

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

const filters = document.querySelectorAll("#filters button");

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        const tasks = document.querySelectorAll("#task-list li");

        tasks.forEach((task) => {
            const isCompleted = task.classList.contains("completed");

            if (filter === "all") {
                task.style.display = "flex";
            } else if (filter === "active") {
                task.style.display = isCompleted ? "none" : "flex";
            } else if (filter === "completed") {
                task.style.display = isCompleted ? "flex" : "none";
            }
        });

        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
    });
});


loadTasks(); // load tasks on page load
