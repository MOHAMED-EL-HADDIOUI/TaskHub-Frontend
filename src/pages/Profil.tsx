import {Sidebar} from "../components/Sidebar.tsx";
import {Header} from "../components/Header.tsx";
import {TaskList} from "../components/TaskList.tsx";
import {UserProfile} from "../components/user/UserProfile.tsx";

const Profil = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen">
                <Header/>
                <UserProfile/>
            </main>
        </div>
    );
};

export default Profil;