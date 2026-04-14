import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { isPastDue, formatDate } from '../../utils/penaltyLogic';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, Clock, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';

const UpcomingAssignments = () => {
  const { user } = useAuth();
  const { groups, assignments, submissions } = useData();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const groupIdFilter = searchParams.get('group');
  
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const studentGroups = groups.filter(g => g.students.includes(user.id));
  const studentGroupIds = studentGroups.map(g => g.id);
  let myAssignments = assignments.filter(a => studentGroupIds.includes(a.groupId));

  if (groupIdFilter) {
    myAssignments = myAssignments.filter(a => a.groupId === groupIdFilter);
  }

  const isCompleted = (assignmentId) => {
    return submissions.some(sub => sub.assignmentId === assignmentId && sub.studentId === user.id);
  };

  const filteredAssignments = myAssignments.filter((assignment) => {
    const isPast = isPastDue(assignment.deadline);
    const completed = isCompleted(assignment.id);

    if (activeTab === 'completed') return completed;
    if (activeTab === 'past_due') return isPast && !completed;
    return !isPast && !completed; 
  });

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800">My Assignments</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">Keep track of your upcoming and overdue work seamlessly.</p>
      </div>

      <div className="flex border-b border-slate-200/80 mb-6 font-bold text-sm">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-4 transition-colors relative ${activeTab === 'upcoming' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Upcoming
          {activeTab === 'upcoming' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-t-xl"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('past_due')}
          className={`pb-3 px-4 transition-colors relative ${activeTab === 'past_due' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Past due
          {activeTab === 'past_due' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-t-xl"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 transition-colors relative ${activeTab === 'completed' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Completed
          {activeTab === 'completed' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-t-xl"></div>}
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-500 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm mt-8">
          <BookOpen size={64} className="text-slate-300 mb-6 drop-shadow-sm" />
          <h2 className="text-2xl font-bold font-display text-slate-700">No Assignments Found</h2>
          <p className="mt-2 text-slate-500">There are no assignments in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => {
          const pastDue = isPastDue(assignment.deadline);
          const assocSub = submissions.find(sub => sub.assignmentId === assignment.id && sub.studentId === user.id);
          const graded = assocSub && !!assocSub.marksAwarded;

          return (
            <Link 
              key={assignment.id} 
              to={`/student/assignments/${assignment.id}`}
              className="block bg-white p-7 rounded-2xl border border-slate-200/60 shadow-[0_4px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 ${pastDue ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-brand-500'} opacity-80`}></div>

              <div className="flex justify-between items-start mb-5 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 uppercase tracking-wider">
                  <BookOpen size={12} />
                  {studentGroups.find(g => g.id === assignment.groupId)?.name}
                </span>

                {pastDue && !activeTab.includes('completed') && (
                  <span className="text-red-500 bg-red-50 p-2 rounded-xl border border-red-100 shadow-sm animate-pulse" title="Past Due">
                    <AlertCircle size={16} />
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold font-display text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-brand-600 transition-colors">
                {assignment.title}
              </h2>
              
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-8">
                {assignment.description}
              </p>

              {activeTab === 'completed' ? (
                <div className={`flex items-center gap-2 text-sm font-semibold pt-5 border-t ${graded ? 'border-brand-100 text-brand-600' : 'border-emerald-100 text-emerald-600'}`}>
                  <CheckCircle size={16} />
                  <span>{graded ? 'Grade Released / Evaluated' : 'Submitted Successfully'}</span>
                  <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${graded ? 'bg-brand-50 group-hover:bg-brand-500 group-hover:text-white' : 'bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                    <ChevronRight size={16} className={`transition-transform duration-300 group-hover:translate-x-0.5`} />
                  </div>
                </div>
              ) : (
                <div className={`flex items-center gap-2 text-sm font-semibold pt-5 border-t ${pastDue ? 'border-red-100 text-red-600' : 'border-slate-100 text-slate-600'}`}>
                  <Clock size={16} />
                  <span>{pastDue ? 'Penalty Active' : formatDate(assignment.deadline)}</span>
                  <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${pastDue ? 'bg-red-50 group-hover:bg-red-500 group-hover:text-white' : 'bg-slate-50 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-[-45deg]'}`}>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${pastDue ? '' : 'group-hover:translate-x-0.5'}`} />
                  </div>
                </div>
              )}
            </Link>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default UpcomingAssignments;
