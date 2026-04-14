import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans relative overflow-hidden">
      {}
      <div className="absolute top-0 left-64 w-[50rem] h-[50rem] bg-blue-100/40 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none mix-blend-multiply"></div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-[76px] bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center px-10 shrink-0 z-10 sticky top-0 shadow-sm">
          <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-3">
            Assignment Deadline Tracker
            <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold tracking-widest uppercase border border-brand-200/50">Enterprise</span>
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-8 lg:p-10 scroll-smooth relative z-0">
          <div className="max-w-7xl mx-auto animate-fade-in relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
