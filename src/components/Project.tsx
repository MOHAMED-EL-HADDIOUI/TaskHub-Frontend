import { useEffect, useState } from "react";
import { Task, Project, User } from "../types";
import { TaskCard } from "./TaskCard";
import { Calendar, Delete, Edit, Plus } from "lucide-react";
import {useNavigate} from "react-router-dom";

interface ProjectProps {
    projectId: string;
}

export function Project_({ projectId }: ProjectProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [taskFormType, setTaskFormType] = useState<"add" | "update" | "delete" | null>(null);
    const [projectFormType, setProjectFormType] = useState<"update" | "delete" | null>(null);
    const navigate = useNavigate();


    // Updated taskData state to match the Task interface
    const [taskData, setTaskData] = useState<Task>({
        id: "",
        title: "",
        description: "",
        status: "todo",
        project: project,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    // Updated projectData state to match the Project interface
    const [projectData, setProjectData] = useState<Omit<Project, 'id' | 'createdAt' | 'taskCounts'>>({
        name: "",
        description: "",
        status: "not_started",
        managerId: "" // Added managerId as required by interface
    });

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                // Récupérer le token de l'utilisateur (par exemple depuis le stockage local)
                const token = localStorage.getItem('auth_token');

                // Vérifier si le token est présent
                if (!token) {
                    throw new Error("No access token found. Please log in.");
                }

                // Configuration des options de fetch avec le header Authorization
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                };

                // Récupérer les détails du projet
                const projectResponse = await fetch(`http://localhost:8000/projects/${projectId}`, {
                    method: "GET",
                    headers: headers
                });
                const projectData = await projectResponse.json();
                setProject(projectData);

                // Récupérer les tâches liées au projet
                const tasksResponse = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
                    method: "GET",
                    headers: headers
                });
                const tasksData = await tasksResponse.json();
                setTasks(tasksData);

                // Récupérer la liste des utilisateurs
                const usersResponse = await fetch(`http://localhost:8000/users`, {
                    method: "GET",
                    headers: headers
                });
                const usersData = await usersResponse.json();
                setUsers(usersData);

            } catch (error) {
                console.error("Error fetching project details", error);
            }

        };

        fetchProjectDetails();
    }, [projectId]);

    const handleProjectFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');

        if (!token) {
            return;
        }
        if (project && projectFormType === "update") {
            try {
                const response = await fetch(`http://localhost:8000/projects/${projectId}/update/`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
                const updatedProject = await response.json();
                setProject(updatedProject);
                setShowProjectForm(false);
                navigate('/dashboard');
            } catch (error) {
                console.error("Error updating project", error);
            }
        }
    };

    const handleTaskFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');

        if (!token) {
            return;
        }

        try {
            switch (taskFormType) {
                case "add":
                    const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks/create/`, {
                        method: "POST",
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        body: JSON.stringify(taskData),
                    });
                    const newTask = await response.json();
                    setTasks(prevTasks => [...prevTasks, newTask]);
                    navigate('/dashboard');

                    break;
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
                    navigate('/dashboard');

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
                    navigate('/dashboard');
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

    const handleProjectInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setProjectData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (!project) return <div>Loading project...</div>;

    return (
        <div className="p-6">
            {/* Project Information Section */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4 text-indigo-950">Project Information</h2>
                <div className="rounded-lg border p-5">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-950">{project.name}</h3>
                    <p className="text-gray-700 text-lg mb-4">{project.description}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => {
                                setProjectFormType("update");
                                setShowProjectForm(true);
                                setProjectData({
                                    name: project.name,
                                    description: project.description,
                                    status: project.status,
                                    managerId: project.managerId
                                });
                            }}
                        >
                            <Edit className="w-4 h-4" />
                            Edit Project
                        </button>
                        <button
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            onClick={() => {
                                setProjectFormType("delete");
                                setShowProjectForm(true);
                            }}
                        >
                            <Delete className="w-4 h-4" />
                            Delete Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4 text-indigo-950">Project Tasks</h2>
                <button
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => {
                        setTaskFormType("add");
                        setShowTaskForm(true);
                        setTaskData({
                            id: "",
                            title: "",
                            description: "",
                            status: "todo",
                            project: project,
                            completed: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                    }}
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {/* Tasks List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks found.</p>
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
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                                    <select
                                        name="assignedTo"
                                        value={taskData.assigned_to}
                                        onChange={handleTaskInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                - {user.username} -
                                            </option>
                                        ))}
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

            {/* Project Form Modal */}
            {showProjectForm && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">
                            {projectFormType === "update" && "Update Project"}
                            {projectFormType === "delete" && "Delete Project"}
                        </h3>
                        {projectFormType === "update" && (
                            <form onSubmit={handleProjectFormSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleProjectInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleProjectInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={projectData.status}
                                        onChange={handleProjectInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                        onClick={() => setShowProjectForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                        {projectFormType === "delete" && (
                            <div className="flex justify-between gap-4">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    onClick={async () => {
                                        const token = localStorage.getItem('auth_token');

                                        if (!token) {
                                            return;
                                        }
                                        try {
                                            await fetch(`http://localhost:8000/projects/${projectId}/delete/`, {
                                                method: "DELETE",
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/json',
                                                },
                                            });
                                            navigate('/dashboard');
                                        } catch (error) {
                                            console.error("Error deleting project", error);
                                        }
                                    }}
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                    onClick={() => setShowProjectForm(false)}
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