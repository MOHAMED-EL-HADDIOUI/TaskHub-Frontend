import { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profil from './pages/Profil';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import ProjectDetail from "./pages/ProjectDetail.tsx";

type ProtectedRoutesProps = {
    isAuthenticated: boolean;
    isLoading: boolean;
};

// Composant pour les routes protégées
const ProtectedRoutes = ({ isAuthenticated, isLoading }: ProtectedRoutesProps) => {
    if (isLoading) {
        return <div>Loading...</div>; // Afficher un écran de chargement pendant la vérification
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projectdetail/:projectId" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

// Composant principal
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier le token au chargement de l'application
        const token = localStorage.getItem('auth_token');

        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        setIsLoading(false); // Fin de la vérification
    }, []);

    // Gestion de la connexion
    const handleLogin = (token: string) => {
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
    };

    // Gestion de la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                {/* Route publique */}
                <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
                {/* Routes protégées */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoutes
                            isAuthenticated={isAuthenticated}
                            isLoading={isLoading}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
