import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthFlow = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [action, setAction] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roll: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = action === 'signin' ? '/api/auth/login' : '/api/auth/register';
    const payload = action === 'signin' 
      ? { email: formData.email, password: formData.password, role }
      : { ...formData, role };
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      if (action === 'signup') {
        setAction('signin');
        setSuccess('Account created successfully! Please sign in.');
        setFormData({ ...formData, password: '' });
      } else {
        localStorage.setItem('adt_token', data.token);
        login(data.user); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setRole(null);
    setAction(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10 transition-all duration-500">
      {}
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/50 text-slate-800 overflow-hidden">
        
        {}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-slate-900">Join the Platform</h2>
              <p className="text-slate-500 text-sm">Select your account type to proceed.</p>
            </div>
            <div className="flex flex-col gap-5">
              <button
                onClick={() => { setRole('student'); setStep(2); }}
                className="group relative flex items-center justify-between w-full py-4 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Student Space</h3>
                  <p className="text-xs text-slate-500 mt-1">Track assignments & grades</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
                </div>
              </button>
              <button
                onClick={() => { setRole('teacher'); setStep(2); }}
                className="group relative flex items-center justify-between w-full py-4 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Educator Portal</h3>
                  <p className="text-xs text-slate-500 mt-1">Manage coursework & penalties</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 text-indigo-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center">
              <button onClick={resetFlow} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold capitalize text-slate-800">{role} Access</h2>
                <p className="text-xs text-slate-500 mt-1">Log in or create a new account</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setAction('signin'); setStep(3); }}
                className="relative overflow-hidden w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all duration-300"
              >
                Sign In to Dashboard
              </button>
              <button
                onClick={() => { setAction('signup'); setStep(3); }}
                className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-300"
              >
                Create an Account
              </button>
            </div>
          </div>
        )}

        {}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center mb-6">
              <button onClick={() => { setStep(2); setError(''); setSuccess(''); }} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <h2 className="text-2xl font-bold text-slate-800">
                {action === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center shadow-sm">
                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm flex items-center shadow-sm">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {action === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-all placeholder:text-slate-400 shadow-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  {role === 'student' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Roll Number</label>
                      <input
                        type="text" name="roll" required value={formData.roll} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-all placeholder:text-slate-400 shadow-sm"
                        placeholder="e.g. 1A"
                      />
                    </div>
                  )}
                </>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <input
                  type="password" name="password" required value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all duration-300 disabled:opacity-70 disabled:shadow-none flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  action === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFlow;
