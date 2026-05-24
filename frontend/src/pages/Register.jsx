import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
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

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please enter all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    // Call simple local registration
    const result = register(formData.name, formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Account created successfully!');
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

      <div className="w-full max-w-[460px] rounded-[32px] bg-white p-8 shadow-xl shadow-slate-100 border border-slate-100/50">
        <div className="text-center">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm mb-4">
            <Brain className="h-6 w-6" />
          </Link>
          <h2 className="font-display text-3xl font-extrabold text-blue-900 leading-tight">Register</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Create an account</p>
        </div>

        {/* Register form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* Name field */}
          <div className="space-y-1.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/10"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/10"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/10"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-700/20 transition-all hover:bg-indigo-800 hover:shadow-indigo-700/30 hover:scale-[1.01] active:scale-100 disabled:bg-indigo-400"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            ) : (
              <>
                Register
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
