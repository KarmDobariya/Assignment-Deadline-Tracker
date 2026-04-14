import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid credentials. Please check your email and password.');
      return;
    }

    login({
      id: user.id,
      name: user.name,
      role: user.role,
      roll: user.roll || null
    });

    if (user.role === 'teacher') navigate('/teacher/overview');
    else navigate('/student/assignments');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      
      <div className="glass w-full max-w-md p-8 md:p-10 rounded-3xl relative z-10 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-brand-500 text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-brand-500/30 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display text-slate-800 text-center">
            Log in to <span className="text-gradient">ADT</span>
          </h1>
          <p className="text-slate-500 mt-2 text-center text-sm font-medium">
            Next-generation deadline tracker & penalty logic
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-medium"
                placeholder="teacher@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-brand-500 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-[0_4px_20px_rgb(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 mt-4"
          >
            <span>Sign In to Portal</span>
            <ArrowRight size={18} className="translate-y-px" />
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-200/60">
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
            <p className="font-semibold text-slate-700 mb-3 text-xs uppercase tracking-wider">Available Demo Roles</p>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                <span className="font-medium flex items-center gap-2">Teacher</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded shadow-sm border border-slate-100">teacher@demo.com</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-medium flex items-center gap-2">Student</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded shadow-sm border border-slate-100">alice@demo.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
