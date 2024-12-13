"use client";

import React, { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import Popup from '../popup/popup';

interface LoginRegisterProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

interface FormProps {
  onClose: () => void;
  onLogin?: () => void;
}

// Login Form Component
const LoginForm: React.FC<FormProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('user', JSON.stringify({
          username: data.username,
          userId: data.user_id,
          isLoggedIn: true,
        }));
        console.log('Sisselogimine õnnestus');
        if (onLogin) onLogin();
        window.location.reload(); // Reload the page to update the header
        onClose();
      } else {
        const data = await response.text();
        setError(data || 'Sisselogimine ebaõnnestus. Palun kontrollige oma kasutajanime ja parooli.');
      }
    } catch (error) {
      setError('Võrgu viga. Palun proovige uuesti.');
      console.error('Viga sisselogimisel:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-7">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <input
        type="text"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-2 text-black"
        placeholder="Kasutajanimi"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-2 mb-2 text-black"
        placeholder="Parool"
        required
      />
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#E31A7E] text-white rounded-full px-4 py-3 hover:bg-[#C40079] transition"
        >
          Logi sisse
        </button>
      </div>
    </form>
  );
};

// Register Form Component
const RegisterForm: React.FC<FormProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('user', JSON.stringify({
          username: data.username,
          userId: data.user_id,
          isLoggedIn: true,
        }));
        console.log('Registreerimine õnnestus');
        if (onLogin) onLogin();
        window.location.reload(); // Reload the page to update the header
        onClose();
      } else {
        const data = await response.text();
        setError(data || 'Registreerimine ebaõnnestus. Palun proovige uuesti.');
      }
    } catch (error) {
      setError('Võrgu viga. Palun proovige uuesti.');
      console.error('Viga registreerimisel:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-7">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <input
        type="text"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-2 text-black"
        placeholder="Kasutajanimi"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-2 mb-2 text-black"
        placeholder="Parool"
        required
      />
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#E31A7E] text-white rounded-full px-4 py-3 hover:bg-[#C40079] transition"
        >
          Registreeru
        </button>
      </div>
    </form>
  );
};

const LoginRegister: React.FC<LoginRegisterProps> = ({ isVisible, onClose, onLogin }) => {
  const [isLoginActive, setIsLoginActive] = useState<boolean>(true);

  const toggleTab = (tab: 'login' | 'register') => {
    setIsLoginActive(tab === 'login');
  };

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={handleClickOutside} // Handle click outside the modal to close it
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl font-bold text-[#E31A7E] hover:text-[#C40079]"
        >
          &times;
        </button>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => toggleTab('login')}
            className={`text-lg pb-1 ${isLoginActive ? 'border-b-2 border-pink-600 font-bold text-black' : 'text-black'}`}
          >
            Logi sisse
          </button>
          <button
            onClick={() => toggleTab('register')}
            className={`text-lg pb-1 ${!isLoginActive ? 'border-b-2 border-pink-600 font-bold text-black' : 'text-black'}`}
          >
            Registreeru
          </button>
        </div>
        {isLoginActive ? (
          <LoginForm onClose={onClose} onLogin={onLogin} />
        ) : (
          <RegisterForm onClose={onClose} onLogin={onLogin} />
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
