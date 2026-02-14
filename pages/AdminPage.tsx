import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AdminPage = () => {
  const { t } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('admin')} {t('login')}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter admin key..."
            />
          </div>
          <button type="submit" className="w-full bg-nepalBlue text-white py-2 rounded-lg hover:bg-blue-800">
            {t('login')}
          </button>
        </form>
        <p className="text-xs text-center mt-4 text-gray-400">Demo Key: admin123</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('admin')} Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4">Add Candidate</h3>
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            <input type="text" placeholder="Party Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            <div className="flex space-x-2">
              <input type="text" placeholder="District" className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input type="number" placeholder="Ward" className="w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Candidate</button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4">Post Hot Topic</h3>
          <form className="space-y-4">
            <input type="text" placeholder="Topic Title" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            <textarea placeholder="Short description..." className="w-full p-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <button className="bg-nepalRed text-white px-4 py-2 rounded hover:bg-red-700">Broadcast Alert</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;