import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Courses from './pages/Courses';
import CourseEmployees from './pages/CourseEmployees';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #06b6d4 100%)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-cyan-400/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/20 via-indigo-500/30 to-purple-600/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce shadow-lg"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/70 rounded-full animate-ping shadow-lg"></div>
        <div className="absolute top-1/2 left-3/4 w-5 h-5 bg-green-400/50 rounded-full animate-pulse shadow-lg"></div>
      </div>

      <header className="border-b border-white/20 bg-black/20 backdrop-blur-md relative z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="https://media.glassdoor.com/sqll/414876/canarys-automations-squarelogo-1430124981937.png"
                alt="Canarys Logo"
                className="h-10 w-10 lg:h-12 lg:w-12 object-contain bg-white/90 rounded-lg p-1 shadow-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-white drop-shadow-lg truncate">Canarys</h1>
                <p className="text-xs sm:text-sm text-white/90 drop-shadow-md truncate">Solution is our Mantra</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}> 
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id/employees" element={<CourseEmployees />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-md relative z-10 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <div className="text-white font-medium">Canarys Automations Limited</div>
            <p className="text-xs sm:text-sm text-white/80">Copyright © 2024 Canarys Automations Limited. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
