'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in localStorage
        const { role } = response.data.user;

        if (role === 'ADMIN') {
          router.push('/admin/pages/Products');
        } else if (role === 'CUSTOMER') {
          router.push('/customer');
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/customer/pages/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-700">Don't have an account?</p>
          <button
            type="button"
            onClick={handleRegister}
            className="w-full mt-2 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
