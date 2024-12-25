import { useParams } from 'react-router-dom';
import {Sidebar} from "../components/Sidebar.tsx";
import {Header} from "../components/Header.tsx";
import {Project_} from "../components/Project.tsx";

const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>(); // Get projectId from the URL params

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen">
                <Header />
                <Project_ projectId={projectId} /> {/* Pass projectId to Project_ component */}
            </main>
        </div>
    );
};

export default ProjectDetail;
