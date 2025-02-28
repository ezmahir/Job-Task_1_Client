import { useState } from "react";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleSave = async () => {
    try {
      await onUpdate(editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
      // Reset to original if update fails
      setEditedTask({ ...task });
    }
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded-md shadow-sm mb-2 border border-gray-200">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={editedTask.description || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-md shadow-sm mb-2 border border-gray-200">
      <div className="mb-1 text-left">
        <h3 className="font-medium text-gray-800">{task.title}</h3>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mb-2 text-left">
          {task.description}
        </p>
      )}
      <div className="flex justify-end space-x-1">
        <button
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs bg-gray-100  rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)} // Using _id instead of id
          className="px-2 py-1 text-xs bg-red-100 text-red-400 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
