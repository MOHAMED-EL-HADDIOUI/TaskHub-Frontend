import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import {useState} from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img src={"/logo.png"} alt="Logo" />
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to access your TaskHub' : 'Get started with TaskHub'}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center">
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
  );
};

export default Auth;