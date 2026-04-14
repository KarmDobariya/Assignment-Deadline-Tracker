import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, FileEdit } from 'lucide-react';

const AssignmentForm = () => {
  const { groups, addAssignment } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [penaltyRate, setPenaltyRate] = useState(10);
  const [maxMarks, setMaxMarks] = useState(100);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let attachmentUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          attachmentUrl = data.url;
        }
      } catch (err) {
        console.error('File upload failed', err);
      }
    }

    addAssignment({
      title,
      description,
      groupId,
      deadline: new Date(deadline).toISOString(),
      penaltyRate: Number(penaltyRate),
      maxMarks: Number(maxMarks),
      attachmentUrl
    });
    setUploading(false);
    navigate('/teacher/overview'); 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none mix-blend-multiply"></div>

      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800 flex items-center gap-3">
          Create New Assignment
          <FileEdit className="text-brand-500" size={28} />
        </h1>
        <p className="text-slate-500 mt-2">Deploy strict educational parameters and automatic late calculations.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full opacity-60"></div>
        
        <div className="relative z-10">
          <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Title</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-400 font-medium"
            placeholder="e.g. Midterm Physics Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="relative z-10">
          <label className="block text-sm font-bold text-slate-700 mb-2">Description / Instructions</label>
          <textarea 
            required
            rows="4"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-400 resize-none font-medium text-sm leading-relaxed"
            placeholder="Provide strict formatting instructions here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Group</label>
            <select
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-slate-700 cursor-pointer"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Strict Deadline</label>
            <div className="relative">
              <input 
                required
                type="datetime-local" 
                className="w-full px-4 py-3.5 pl-11 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-slate-700"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <CalendarClock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-gradient-to-br from-orange-50/80 to-white border border-orange-100 rounded-2xl shadow-sm">
          <div>
            <label className="block text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
              Late Penalty Rate
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-200/50 text-orange-800 px-2 py-0.5 rounded-md border border-orange-200">% per day</span>
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm text-lg font-bold text-orange-900"
                value={penaltyRate}
                onChange={(e) => setPenaltyRate(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-400 font-bold">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Total Maximum Marks</label>
            <input 
              type="number" 
              min="1"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-lg font-bold text-slate-800"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />
          </div>
        </div>

        <div className="relative z-10">
          <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Attach Reference File (Optional)</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
        </div>

        <div className="pt-4 border-t border-slate-100/80 flex justify-end relative z-10">
          <button 
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-blue-600 to-brand-500 text-white font-bold py-3.5 px-8 rounded-xl hover:shadow-[0_8px_20px_rgb(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tracking-wide disabled:opacity-70 flex items-center justify-center"
          >
            {uploading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Deploy Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
