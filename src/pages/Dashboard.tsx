import {Header} from "../components/Header.tsx";
import {Sidebar} from "../components/Sidebar.tsx";
import {TaskList} from "../components/TaskList.tsx";

const Dashboard = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen">
                <Header/>
                <TaskList/>
            </main>
        </div>
    );
};

export default Dashboard;
