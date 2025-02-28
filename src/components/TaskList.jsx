import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const TaskList = ({ title, tasks, onUpdate, onDelete }) => {
  return (
    <div className="w-full md:w-80 p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
      <Droppable droppableId={title}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-24"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task._id || `task-${index}`}
                draggableId={task._id ? task._id.toString() : `task-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
