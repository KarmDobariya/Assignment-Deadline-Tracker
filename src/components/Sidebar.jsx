import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  FileEdit, 
  BarChart, 
  LogOut, 
  ShieldCheck,
  Component
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher/overview', icon: <Users size={20} /> },
    { name: 'Manage Groups', path: '/teacher/groups', icon: <Component size={20} /> },
    { name: 'New Assignment', path: '/teacher/assignments/new', icon: <FileEdit size={20} /> },
    { name: 'Penalties & Reports', path: '/teacher/penalties', icon: <BarChart size={20} /> },
  ];

  const studentLinks = [
    { name: 'My Groups', path: '/student/groups', icon: <Users size={20} /> },
    { name: 'My Assignments', path: '/student/assignments', icon: <BookOpen size={20} /> },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="w-[280px] bg-dark-900 border-r border-slate-800 text-white min-h-screen flex flex-col shadow-2xl relative z-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

      <div className="p-7 border-b border-white/5 flex items-center gap-4">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-brand-500 rounded-xl shadow-lg shadow-brand-500/20">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="font-bold font-display text-2xl tracking-tight text-white">ADT <span className="text-brand-400">Portal</span></h1>
      </div>
      
      <div className="flex-1 py-8 overflow-y-auto">
        <div className="px-7 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Menu Navigation
        </div>
        <nav className="space-y-1.5 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                    : 'text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className={`${isActive ? 'text-brand-400' : 'text-slate-500'} transition-colors`}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5 bg-dark-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-bold shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
              <p className="text-[11px] text-brand-400 font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/20 py-2.5 px-4 rounded-lg transition-all duration-300 w-full font-medium shadow-sm hover:shadow-red-500/10"
          >
            <LogOut size={16} />
            <span>Secure Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
