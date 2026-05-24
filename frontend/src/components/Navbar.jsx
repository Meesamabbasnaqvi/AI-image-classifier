import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Settings, Sparkles, Key, Check, AlertCircle, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  // Load API Key from LocalStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('deepnet_gemini_api_key') || '';
    setApiKey(savedKey);
    setHasKey(!!savedKey);
  }, []);

  // Save API Key to LocalStorage
  const handleSaveKey = (e) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();

    if (cleanKey) {
      localStorage.setItem('deepnet_gemini_api_key', cleanKey);
      setHasKey(true);
      toast.success('Gemini API Key saved successfully! Live Cloud Vision enabled.');
    } else {
      localStorage.removeItem('deepnet_gemini_api_key');
      setHasKey(false);
      toast.success('Gemini API Key removed. Reverted to Simulator Mode.');
    }
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-100">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                AI Image Classifier
              </span>
            </div>
          </Link>
        </div>

        {/* User Session, Logout, and API Key settings */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status indicator */}
          <div
            onClick={() => setIsModalOpen(true)}
            className={`cursor-pointer hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all hover:scale-[1.02] ${hasKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
              }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{hasKey ? 'Gemini Live' : 'Simulator Mode'}</span>
          </div>

          {/* Key config gear */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            title="Configure API Keys"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>

          {/* User profile details and logout */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-100 pl-3 sm:pl-4">
              <div className="hidden flex-col text-right sm:flex">
                <span className="text-xs font-bold text-slate-700">{user.name}</span>
                <span className="text-[9px] font-semibold text-slate-400">{user.email}</span>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700 border border-indigo-200 font-display font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>


    </>
  );
};

export default Navbar;
