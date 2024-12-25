import { Calendar, Delete, Edit, Flag, User as UserIcon } from "lucide-react";
import { Task } from "../types";

const statusColors = {
    'todo': 'bg-gray-100',
    'in-progress': 'bg-blue-100',
    'completed': 'bg-green-100',
};

interface TaskCardProps {
    task: Task;
    onUpdate: () => void;
    onDelete: () => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const formattedDate = new Date(task.created_at).toLocaleDateString('en-EN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={`p-6 rounded-lg border mb-4 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${statusColors[task.status]}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-xl text-indigo-950">{task.title}</h3>
            </div>

            <p className="text-gray-700 mb-4">{task.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                </div>

                <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    {task.status}
                </div>

                {task.assigned_to && (
                    <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>Assigned to: {task.assigned_to.username}</span>
                    </div>
                )}

                {task.completed && task.completed_by && (
                    <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>Completed by: {task.completed_by.username}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-5">
                <button
                    onClick={onUpdate}
                    className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                >
                    <Delete className="w-5 h-5 mr-2" />
                    Delete
                </button>
            </div>
        </div>
    );
}
