import React from 'react';
import AuthFlow from '../components/Auth/AuthFlow';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 grid grid-cols-1 md:grid-cols-2 relative overflow-hidden font-sans">
      
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>

      {}
      <div className="flex flex-col justify-center items-start p-10 md:p-24 relative z-10 w-full mb-10 md:mb-0">
        
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-semibold text-xs tracking-widest uppercase mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Next-Gen Academic Tool</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-loose md:leading-tight">
          <span className="text-slate-900 block pb-2">Assignment</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 block mb-2">
            Deadline Tracker
          </span>
          <span className="text-slate-500 font-bold block text-3xl md:text-4xl mt-2 tracking-normal border-t-2 border-indigo-100/50 pt-4 w-fit">
            with late penalty logic.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-light max-w-lg">
          The ultimate platform for modern education. Featuring predictive penalty tracking, intelligent dashboards, and seamless cross-role collaboration.
        </p>
        
        <div className="space-y-4 w-full max-w-md">
          <div className="group flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="p-3 bg-blue-50 flex items-center justify-center rounded-xl text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Lightning Fast Workflows</h3>
              <p className="text-sm text-slate-500 mt-1">Submit assignments with zero latency straight to the server interface.</p>
            </div>
          </div>
          
          <div className="group flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="p-3 bg-indigo-50 flex items-center justify-center rounded-xl text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Secure Penalty Engine</h3>
              <p className="text-sm text-slate-500 mt-1">Automated grade capping verified securely on our synchronized database.</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex justify-center items-center p-6 md:p-12 relative z-10 w-full mb-10 md:mb-0">
        <AuthFlow />
      </div>
      
    </div>
  );
};

export default Home;
