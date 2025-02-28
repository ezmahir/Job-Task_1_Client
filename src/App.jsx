import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import { DragDropContext } from "@hello-pangea/dnd";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tasks:", data); // Log the data to see its structure
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title is required");
      return;
    }
    if (!newTaskDescription.trim()) {
      setError("Task description is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          category: "To-Do", // Using category instead of status to match backend
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsCreatingTask(false);
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (updatedTask) => {
    setLoading(true);
    setError(null);
    try {
      // Convert status to category for backend compatibility
      const backendTask = {
        ...updatedTask,
        category: updatedTask.category || updatedTask.status, // Use category if exists, otherwise use status
      };

      // Remove status field if it exists to avoid confusion
      if (backendTask.status) {
        delete backendTask.status;
      }

      const taskId = updatedTask._id; // Use _id instead of id
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendTask),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Find the task
    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;

    // Create updated task with new category
    const updatedTask = { ...draggedTask, category: destination.droppableId };

    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Map backend categories to frontend lists
  const todoTasks = tasks.filter((task) => task.category === "To-Do");
  const inProgressTasks = tasks.filter(
    (task) => task.category === "In Progress"
  );
  const doneTasks = tasks.filter((task) => task.category === "Done");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Task Management App
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {isCreatingTask ? (
        <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <textarea
              placeholder="Enter task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreatingTask(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={createTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingTask(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add New Task
        </button>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
          <TaskList
            title="To-Do"
            tasks={todoTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
          <TaskList
            title="In Progress"
            tasks={inProgressTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
          <TaskList
            title="Done"
            tasks={doneTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </DragDropContext>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default App;
