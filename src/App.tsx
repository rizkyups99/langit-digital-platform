import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider, ToastContainer } from './contexts/ToastContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/user-panel" element={<UserPanel />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
              </Routes>
              <ToastContainer />
            </div>
          </Router>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;