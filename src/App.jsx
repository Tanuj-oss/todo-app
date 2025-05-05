import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Existing state for tasks, text, description, filter, darkMode
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  // NEW: state for new task's priority (default "Medium")
  const [taskPriority, setTaskPriority] = useState("Medium");
  // NEW: state for filtering by priority (default "all")
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Apply dark mode class to body
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
      // NEW: include the selected priority in the task
      priority: taskPriority
    };
    setTasks([...tasks, newTask]);
    setTaskText("");
    setTaskDesc("");
    // Reset priority if desired (optional, keep default Medium or last selection)
    setTaskPriority("Medium");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Combine filters: by status and by priority
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
      return true; // "all"
    });

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
        {/* NEW: Priority dropdown for selecting High/Medium/Low */}
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
          <li key={task.id} style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            <div className="task-info">
              <span className={task.completed ? "completed" : ""}>
                {task.text}
              </span>
              {/* Show description if present */}
              {task.description && (
                <p className="description">{task.description}</p>
              )}
              {/* NEW: Show the priority label, styled by its class */}
              <span className={"priority-" + task.priority.toLowerCase()}>
                {task.priority}
              </span>
            </div>
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
      {/* NEW: Priority filter buttons */}
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
