import {Bell, LogOut, Settings, User} from 'lucide-react';
import {useNavigate} from "react-router-dom";

export function Header() {
  const navigate = useNavigate(); // Hook for navigation

  const goToDashboardd = ()=>{
    navigate('/dashboard'); // Redirect to dashboard
  }
  const goToProfil= ()=>{
    navigate('/profil'); // Redirect to dashboard
  }
  const logOut= ()=>{
    localStorage.removeItem('auth_token');
    navigate('/auth'); // Redirect to dashboard
  }
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-indigo-950 text-4xl font-bold" onClick={goToDashboardd} >Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button   className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={goToProfil}

            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={logOut} className="p-2 hover:bg-gray-100 rounded-full">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}