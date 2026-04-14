import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, UserPlus, Component } from 'lucide-react';

const GroupManagement = () => {
  const { groups, users, addGroup, addStudentToGroup, refreshStudents } = useData();
  const [newGroupName, setNewGroupName] = useState('');
  
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  
  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  
  useEffect(() => {
    if (refreshStudents) {
      refreshStudents();
    }
  }, []);

  const students = users.filter(u => u.role === 'student');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      addGroup(newGroupName);
      setNewGroupName('');
      
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (selectedGroupId && selectedStudentId) {
      addStudentToGroup(selectedGroupId, selectedStudentId);
      setSelectedStudentId('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800 flex items-center gap-3">
          Group Management
          <Component className="text-brand-500" size={28} />
        </h1>
        <p className="text-slate-500 mt-2">Create structural class layouts and manually onboard missing students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl shadow-sm">
              <Component size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-display">Create New Group</h2>
          </div>
          
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Group Identifier</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="e.g. Physics 101"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-blue-500/20 w-full"
            >
              Construct Group
            </button>
          </form>
        </div>

        {}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 rounded-xl shadow-sm">
              <UserPlus size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-display">Enroll Student</h2>
          </div>

          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Target Group</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 shadow-inner"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                <option value="" disabled>-- Select a group --</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
              <select
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="" disabled>-- Select a student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.roll ? `(${s.roll})` : ''}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-brand-500/20 w-full"
            >
              Enroll into Group
            </button>
          </form>
        </div>

      </div>

      {}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm mt-8">
        <h2 className="text-xl font-bold font-display text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Users size={20} className="text-slate-400" />
          Roster Verification
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(g => (
            <div key={g.id} className="p-4 border border-slate-200/60 rounded-xl bg-slate-50">
              <h3 className="font-bold text-slate-800">{g.name}</h3>
              <p className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">{g.students.length} students attached</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.students.map(sid => {
                  const s = users.find(u => u.id === sid);
                  return (
                    <span key={sid} className="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                      {s ? s.name : sid}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
