import { useState } from 'react';
import { User, Mail, Lock, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message on each submission

        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }

            const data = await response.json();
            alert('Registration successful');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Choose a password"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Create Account
            </button>
        </form>
    );
}