import { useState, useEffect } from "react";
import { Plus, FolderKanban, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Project } from "../types";

export function Sidebar() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectData, setNewProjectData] = useState({
        name: '',
        description: '',
        status: 'not_started',
    });
    const navigate = useNavigate();

    // Fetch projects from the API
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setError('No token found.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/projects', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setError('No token found.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/projects/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProjectData),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            const createdProject = await response.json();
            setProjects(prevProjects => [...prevProjects, createdProject]);
            setShowNewProjectModal(false);
            setNewProjectData({
                name: '',
                description: '',
                status: 'not_started',
            });

            // Navigate to the newly created project
            navigate(`/projectdetail/${createdProject.id}`);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProjectData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const goToProjects = () => {
        navigate('/projects');
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const goToProjectDetail = (projectId: string) => {
        navigate(`/projectdetail/${projectId}`);
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <img
                        src="/logo.png"
                        alt="logo"
                        onClick={goToDashboard}
                        className="cursor-pointer"
                    />
                </div>
                <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>

                <div className="space-y-2">
                    <h2 className="text-gray-400 text-sm font-medium mb-2">Projects</h2>
                    <button
                        onClick={goToProjects}
                        className="flex items-center gap-2 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                        <FolderKanban className="w-4 h-4" />
                        All Projects
                    </button>
                    {projects.length === 0 ? (
                        <p className="text-gray-400"></p>
                    ) : (
                        projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => goToProjectDetail(project.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                                <FolderKanban className="w-4 h-4" />
                                {project.name}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                            <button
                                onClick={() => setShowNewProjectModal(false)}
                                className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProjectData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newProjectData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project description"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={newProjectData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewProjectModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}