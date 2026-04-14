import { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, LayoutGrid, CheckCircle } from 'lucide-react';

const Overview = () => {
  const { groups, users, refreshStudents } = useData();
  const students = users.filter((u) => u.role === 'student');

  useEffect(() => {
    if (refreshStudents) refreshStudents();
  }, [refreshStudents]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800">Teacher Overview</h1>
        <p className="text-slate-500 mt-2">Manage your groups and enrolled students at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-sm border border-blue-200/50">
                <LayoutGrid size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-slate-800">Active Groups</h2>
                <p className="text-sm font-medium text-slate-500">{groups.length} active classes</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {groups.map((group) => (
              <div key={group.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex justify-between items-center transition-all duration-200 hover:bg-white hover:shadow-md hover:border-blue-100 group">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-semibold text-slate-700">{group.name}</span>
                </div>
                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 shadow-sm">
                  {group.students.length} Enrolled
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 rounded-2xl shadow-sm border border-brand-200/50">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800">All Students</h2>
              <p className="text-sm font-medium text-slate-500">Global directory overview</p>
            </div>
          </div>
          
          <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200/60">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase text-[10px] tracking-widest bg-slate-50/50">Roll No</th>
                  <th className="px-5 py-4 font-semibold uppercase text-[10px] tracking-widest bg-slate-50/50">Name</th>
                  <th className="px-5 py-4 font-semibold uppercase text-[10px] tracking-widest bg-slate-50/50 text-right">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs">{student.roll}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">{student.name}</td>
                    <td className="px-5 py-4 text-slate-500 font-medium text-right">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
