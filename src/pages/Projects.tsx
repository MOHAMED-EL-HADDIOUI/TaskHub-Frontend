import {Sidebar} from "../components/Sidebar.tsx";
import {Header} from "../components/Header.tsx";
import {ProjectList} from "../components/ProjectList.tsx";

const Projects = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen">
                <Header/>
                <ProjectList/>
            </main>
        </div>
    );
};

export default Projects;