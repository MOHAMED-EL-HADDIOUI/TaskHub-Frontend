import { User, Mail, Calendar } from 'lucide-react';
import { useEffect, useState } from "react";

export function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setError('No token found.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/user/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserData(data); // Set the user data on success

        // Format the date after userData is fetched
        if (data.date_joined) {
          const formattedDate = new Date(data.date_joined).toLocaleDateString('en-EN', {
            weekday: 'long', // Optional, if you want to display the weekday
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          setFormattedDate(formattedDate);
        }
      } catch (err) {
        setError(err.message); // Set error message on failure
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-100 p-3 rounded-full">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome, {userData.username}</h2>
            <p className="text-gray-600">Full Name: {userData.first_name} {userData.last_name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>Member since {formattedDate}</span>
          </div>
        </div>
      </div>
  );
}
