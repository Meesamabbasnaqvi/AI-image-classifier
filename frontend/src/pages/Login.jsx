import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Brain, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    
    // Call simple local login
    const result = login(formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/upload');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-50 px-4 py-12 relative overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[460px] rounded-3xl bg-white p-8 shadow-xl shadow-slate-100 border border-slate-100/50">
        <div className="text-center">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm mb-4">
            <Brain className="h-6 w-6" />
          </Link>
          <h2 className="font-display text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-slate-400">Sign in to classify images</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                id="email-input"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/20"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                id="password-input"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/20"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-100 disabled:bg-indigo-400"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
