import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message on each submission

        // Basic input validation
        if (!username || !password) {
            setError('Both username and password are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.error || 'Invalid credentials');
            }

            const data = await response.json();
            if (data.access) {
                localStorage.setItem('auth_token', data.access); // Store the token in localStorage
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                throw new Error('Token not received');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Sign In
            </button>
        </form>
    );
}
