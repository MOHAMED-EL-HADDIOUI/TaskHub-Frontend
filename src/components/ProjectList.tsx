import { Project } from '../types';  // Adjust the path according to your project structure
import { Plus } from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <div className={`p-4 rounded-lg border mb-3`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold mb-4 text-indigo-950 text-xl">{project.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                </div>
                <div className="flex items-center gap-1">
                </div>
            </div>
            <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4"/>
                New Task
            </button>
        </div>
    );
}

export const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate(); // Hook for navigation


    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/projects/', {
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
                navigate('/dashboard'); // Redirect to dashboard

            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-950">Projects</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};
