let tasks = [];
let highPriorityCount = 0;

window.onload = function () {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    displayTasks();

    highPriorityCount =
      parseInt(localStorage.getItem("highPriorityCount")) || 0;
    updateTaskCount();
  }
};

document
  .getElementById("taskForm")
  .addEventListener("submit", function (event) {
    if (!event.target.checkValidity()) {
      event.preventDefault();
      alert("Please fill in all required fields.");
    } else {
      addTask();
    }
  });

function addTask() {
  const taskName = document.getElementById("taskName").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const higherPriority = document.getElementById("highCount");
  const topHigherPriority = document.getElementById("topHighCount");
  console.log(topHigherPriority.textContent, "top");
  console.log("P", priority);
  const status = document.getElementById("status").value;

  // higherPriority.innerText=highPriorityCount;

  if (priority === "high") {
    highPriorityCount = highPriorityCount + 1;
  }

  higherPriority.innerText = highPriorityCount;
  topHigherPriority.innerText = highPriorityCount + " of " + tasks.length;

  const task = {
    name: taskName,
    dueDate: dueDate,
    priority: priority,
    status: status,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
}

function displayTasks() {
  const taskList = document.getElementById("taskList");
  const noTasksMessage = document.getElementById("noTasksMessage");
  const noTaskIcon = document.getElementById("noTaskIcon");

  if (tasks.length === 0) {
    taskList.innerHTML = "";
    noTasksMessage.style.display = "block";
    noTaskIcon.style.display = "block";
    updateTaskCount();
  } else {
    noTasksMessage.style.display = "none";
    noTaskIcon.style.display = "none";

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskDiv = document.createElement("div");

      taskDiv.classList.add("task");

      taskDiv.innerHTML = `
      <div class="task-list-container">
      <div class="task-details">
        <div>Due Date: ${task.dueDate}</div>
        <div>Priority: ${task.priority}</div> 
        <div>Status: ${task.status}</div> 
      </div><br>

      <div>
        <input type="checkbox" id="chk${index}" onchange="toggleDone(${index})" ${
        task.status === "done" ? "checked" : ""
      }>
    <label for="chk${index}" class="task-name ${
        task.status === "done" ? "done" : ""
      }">${task.name}</label>
      </div>
    </div>

    <div class="d-flex">
      <i onclick="editTask(${index})"><img src="./assets/edit-button.svg"></i>
      <i onclick="deleteTask(${index})"><img src="./assets/delete-icon.svg"></i>
    </div>
        
        `;

      taskList.appendChild(taskDiv);
    });

    updateTaskCount();
  }
}

function toggleDone(index) {
  const checkbox = document.getElementById(`chk${index}`);
  const taskNameLabel = document.querySelector(`label[for=chk${index}]`);

  tasks[index].status = checkbox.checked ? "done" : "todo";

  // Storing the updated tasks array to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (checkbox.checked) {
    taskNameLabel.style.textDecoration = "line-through";
  } else {
    taskNameLabel.style.textDecoration = "none";
  }

  taskNameLabel.classList.toggle("done", checkbox.checked);
  updateTaskCount();
}

function editTask(index) {
  const newName = prompt("Enter new task name:");
  if (newName !== null) {
    tasks[index].name = newName;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
  }
}

function deleteTask(index) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
  }
}

function updateTaskCount() {
  const taskCount = document.getElementById("taskCount");
  const completedValue = document.getElementById("completed");

  taskCount.classList.add("taskCountDetails");
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  completedValue.innerText = `${doneCount}`;

  localStorage.setItem("highPriorityCount", highPriorityCount);
  localStorage.setItem("doneCount", doneCount);

  taskCount.innerHTML = `To-do list:<span class="info"> ${tasks.length}</span> | To-do:<span class="info"> ${todoCount}</span> | In Progress:<span class="info"> ${inProgressCount}</span> | Done :<span class="info"> ${doneCount}</span>`;
}

function filterTasks() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm) ||
      task.dueDate.toLowerCase().includes(searchTerm) ||
      task.priority.toLowerCase().includes(searchTerm) ||
      task.status.toLowerCase().includes(searchTerm)
  );
  displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
    <div class="task-list-container">
      <div class="task-details">
        <div>Due Date: ${task.dueDate}</div>
        <div>Priority: ${task.priority}</div> 
        <div>Status: ${task.status}</div> 
      </div><br>

      <div>
        <input type="checkbox" id="chk${index}" onchange="toggleDone(${index})" ${
      task.status === "done" ? "checked" : ""
    }>
    <label for="chk${index}" class="task-name ${
      task.status === "done" ? "done" : ""
    }">${task.name}</label>
      </div>
    </div>

    <div class="d-flex">
      <i onclick="editTask(${index})"><img src="./assets/edit-button.svg"></i>
      <i onclick="deleteTask(${index})"><img src="./assets/delete-icon.svg"></i>
    </div>
        
        `;

    taskList.appendChild(taskDiv);
  });

  updateTaskCount();
}
