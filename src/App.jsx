import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (!taskText) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      description: taskDesc,
      completed: false,
      priority: taskPriority,
    };
    setTasks([...tasks, newTask]);
    setTaskText("");
    setTaskDesc("");
    setTaskPriority("Medium");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter(task => {
      if (priorityFilter === "high") return task.priority === "High";
      if (priorityFilter === "medium") return task.priority === "Medium";
      if (priorityFilter === "low") return task.priority === "Low";
      return true;
    });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className={`app ${darkMode ? "dark-theme" : ""}`}>
      <h1>
        To-Do List
        <span
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </span>
      </h1>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
        <span className="progress-label">
          {Math.round(progressPercent)}% Completed
        </span>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            <div className="task-info">
              <span className={task.completed ? "completed" : ""}>
                {task.text}
              </span>
              {task.description && (
                <p className="description">{task.description}</p>
              )}
              <span className={"priority-" + task.priority.toLowerCase()}>
                {task.priority}
              </span>
            </div>
            {/* Delete button */}
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <div className="filters">
        <button onClick={clearCompleted}>Clear Completed</button>
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active-filter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="priority-filters">
        <span>Priority:</span>
        <button
          className={priorityFilter === "all" ? "active-filter" : ""}
          onClick={() => setPriorityFilter("all")}
        >
          All
        </button>
        <button
          className={priorityFilter === "high" ? "active-filter" : ""}
          onClick={() => setPriorityFilter("high")}
        >
          High
        </button>
        <button
          className={priorityFilter === "medium" ? "active-filter" : ""}
          onClick={() => setPriorityFilter("medium")}
        >
          Medium
        </button>
        <button
          className={priorityFilter === "low" ? "active-filter" : ""}
          onClick={() => setPriorityFilter("low")}
        >
          Low
        </button>
      </div>
    </div>
  );
}

export default App;
