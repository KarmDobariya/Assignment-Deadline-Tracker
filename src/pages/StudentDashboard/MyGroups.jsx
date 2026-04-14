import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyGroups = () => {
  const { user } = useAuth();
  const { groups, teachers } = useData();

  const enrolledGroups = groups.filter(g => g.students.includes(user.id));

  if (!enrolledGroups.length) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm">
        <Users size={64} className="text-slate-300 mb-6 drop-shadow-sm" />
        <h2 className="text-2xl font-bold font-display text-slate-700">No Groups Found</h2>
        <p className="mt-2 text-slate-500">You are currently not enrolled in any class groups.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800">My Groups</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">View your assigned class groups and current instructors.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledGroups.map((group) => {
          
          const teacher = (teachers || []).find(t => t.id === group.teacherId || t.username === group.teacherId);
          const teacherNameFallback = typeof group.teacherId === 'string' && group.teacherId.startsWith('teacher') ? 'Teacher ' + group.teacherId.replace('teacher', '') : 'Assigned Instructor';
          const teacherName = group.teacherName || (teacher ? teacher.name : teacherNameFallback);

          return (
            <Link 
              key={group.id} 
              to={`/student/assignments?group=${group.id}`}
              className="block bg-white p-7 rounded-2xl border border-slate-200/60 shadow-[0_4px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-brand-500 opacity-80"></div>

              <div className="flex justify-between items-start mb-5 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  Instructor: {teacherName}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-brand-600 transition-colors">
                {group.name}
              </h2>
              
              <div className={`flex items-center gap-2 text-sm font-semibold pt-6 mt-4 border-t border-slate-100 text-slate-600`}>
                <span className="text-brand-600">View Active Assignments</span>
                <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white`}>
                  <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyGroups;
