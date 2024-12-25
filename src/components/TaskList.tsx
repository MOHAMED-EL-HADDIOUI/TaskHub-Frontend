import { useEffect, useState } from 'react';
import { Calendar, Flag } from 'lucide-react';
import { Task } from '../types';
import {TaskCard} from "./TaskCard.tsx";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormType, setTaskFormType] = useState< "update" | "delete" | null>(null);
  const [taskData, setTaskData] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "todo",
    completed: false,
  });
  const handleTaskFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return;
    }

    try {
      switch (taskFormType) {
        case "update":
          if (taskData.id) {
            const response = await fetch(`http://localhost:8000/tasks/${taskData.id}/update/`, {
              method: "PUT",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(taskData),
            });
            const updatedTask = await response.json();
            setTasks(prevTasks =>
                prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
            );
          }
          break;


        case "delete":
          if (taskData.id) {
            await fetch(`http://localhost:8000/tasks/${taskData.id}/delete/`, {
              method: "DELETE",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskData.id));
          }
          break;

      }
      setShowTaskForm(false);
    } catch (error) {
      console.error("Error handling task operation", error);
    }
  };

  const handleTaskInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Effectuer la requête API pour récupérer les tâches assignées à l'utilisateur connecté
    async function fetchTasks() {
      try {
        // Récupérer le token depuis le localStorage (ou ailleurs selon votre implémentation)
        const token = localStorage.getItem('auth_token');  // Remplacez cette ligne si vous utilisez une autre méthode pour stocker le token

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:8000/tasks/assignedto/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Ajout du token dans les en-têtes
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);  // Stocker les tâches dans l'état
      } catch (err) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);  // Fin du chargement
      }
    }

    fetchTasks();
  }, []);  // Le tableau vide [] signifie que l'effet s'exécute une seule fois au montage

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="m-3"><h3 className="text-xl font-bold mb-4">0 Tasks</h3></div>;
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4 text-indigo-950">Tasks</h2>
          <p className="text-gray-600">Manage and track your project tasks</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.length === 0 ? (
              <p>No tasks found.</p>
          ) : (
              tasks.map((task) => (
                  <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={() => {
                        setTaskFormType("update");
                        setTaskData(task);
                        setShowTaskForm(true);
                      }}
                      onDelete={() => {
                        setTaskFormType("delete");
                        setTaskData(task);
                        setShowTaskForm(true);
                      }}
                  />
              ))
          )}
        </div>
          {/* Task Form Modal */}
          {showTaskForm && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg w-1/3">
                      <h3 className="text-xl font-bold mb-4">
                          {taskFormType === "add" && "Add New Task"}
                          {taskFormType === "update" && "Update Task"}
                          {taskFormType === "delete" && "Delete Task"}
                      </h3>
                      {(taskFormType === "add" || taskFormType === "update") && (
                          <form onSubmit={handleTaskFormSubmit}>
                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700">Title</label>
                                  <input
                                      type="text"
                                      name="title"
                                      value={taskData.title}
                                      onChange={handleTaskInputChange}
                                      required
                                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                  />
                              </div>
                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700">Description</label>
                                  <textarea
                                      name="description"
                                      value={taskData.description}
                                      onChange={handleTaskInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                  />
                              </div>
                              <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700">Status</label>
                                  <select
                                      name="status"
                                      value={taskData.status}
                                      onChange={handleTaskInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                  >
                                      <option value="todo">To Do</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                  </select>
                              </div>
                              <div className="flex justify-between gap-4">
                                  <button
                                      type="submit"
                                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                      Save
                                  </button>
                                  <button
                                      type="button"
                                      className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                      onClick={() => setShowTaskForm(false)}
                                  >
                                      Cancel
                                  </button>
                              </div>
                          </form>
                      )}
                      {taskFormType === "delete" && (
                          <div className="flex justify-between gap-4">
                              <button
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                  onClick={handleTaskFormSubmit}
                              >
                                  Confirm Delete
                              </button>
                              <button
                                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                  onClick={() => setShowTaskForm(false)}
                              >
                                  Cancel
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          )}
      </div>
  );
}
