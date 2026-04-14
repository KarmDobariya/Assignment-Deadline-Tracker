import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { calculatePenalty, formatDate } from '../../utils/penaltyLogic';
import * as XLSX from 'xlsx';
import { Download, Calculator, FileText, CheckCircle, Save, ExternalLink, Users } from 'lucide-react';

const PenaltyView = () => {
  const { assignments, groups, submissions, users, gradeSubmission } = useData();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  
  const filteredAssignments = assignments.filter(a => a.groupId === selectedGroupId);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(filteredAssignments[0]?.id || '');
  
  
  const [editingGrade, setEditingGrade] = useState({});
  


  useEffect(() => {
    if (filteredAssignments.length > 0) {
      if (!filteredAssignments.find(a => a.id === selectedAssignmentId)) {
         setSelectedAssignmentId(filteredAssignments[0].id);
      }
    } else {
      setSelectedAssignmentId('');
    }
  }, [selectedGroupId, assignments]);

  const activeAssignment = filteredAssignments.find(a => a.id === selectedAssignmentId);

  const mappedSubmissions = activeAssignment ? submissions
    .filter(sub => sub.assignmentId === activeAssignment.id)
    .map(sub => {
      const student = users.find(u => u.id === sub.studentId);
      const penaltyInf = calculatePenalty(activeAssignment.deadline, sub.submittedAt, activeAssignment.penaltyRate);
      
      const rawMark = sub.marksAwarded || 0;
      const finalMarks = rawMark * penaltyInf.finalScoreMultiplier;

      return {
        ...sub,
        studentName: student?.name || 'Unknown',
        studentRoll: student?.roll || 'N/A',
        penaltyInfo: penaltyInf,
        isGraded: !!sub.marksAwarded, 
        rawMark,
        finalMarks: Number(finalMarks.toFixed(2))
      };
    }) : [];

  const handleExport = () => {
    if (!mappedSubmissions.length) return;

    const exportData = mappedSubmissions.map(sub => ({
      'Roll Number': sub.studentRoll,
      'Student Name': sub.studentName,
      'Submitted At': formatDate(sub.submittedAt),
      'Days Late': sub.penaltyInfo.daysLate,
      'Penalty Applied (%)': sub.penaltyInfo.penaltyPercentage + '%',
      'Original Marks': sub.rawMark,
      'Final Marks': sub.finalMarks
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Penalties');
    XLSX.writeFile(workbook, `Report_${activeAssignment.id}.xlsx`);
  };

  const saveGrade = (subId) => {
    const mark = editingGrade[subId];
    if (mark !== undefined && mark !== '') {
      gradeSubmission(subId, mark);
    }
  };



  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-800 flex items-center gap-3">
            Penalty Engine & Grading
            <Calculator className="text-brand-500" size={28} />
          </h1>
          <p className="text-slate-500 mt-2">Input original marks and let the engine dynamically extract late penalties.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={!mappedSubmissions.length}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] min-w-[200px]"
        >
          <Download size={18} className="translate-y-px" />
          <span>Generate XLSX Report</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-8 relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Users size={16} className="text-brand-500" /> Target Group
            </label>
            <select
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold text-slate-700 cursor-pointer shadow-inner"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" /> Evaluation Filter (Assignments)
            </label>
            <select
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 cursor-pointer shadow-inner disabled:opacity-60"
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              disabled={filteredAssignments.length === 0}
            >
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))
              ) : (
                <option value="">No assignments found</option>
              )}
            </select>
          </div>
        </div>

        {activeAssignment && (
          <div className="flex flex-col md:flex-row gap-4 p-5 md:p-6 bg-gradient-to-r from-blue-50 to-brand-50/50 rounded-2xl border border-blue-100/50">
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Target Deadline</span>
              <span className="text-slate-800 font-bold">{formatDate(activeAssignment.deadline)}</span>
            </div>
            <div className="w-px bg-blue-200/50 hidden md:block"></div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Strict Penalty Logic</span>
              <span className="text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded shadow-sm">{activeAssignment.penaltyRate}% deduction / day late</span>
            </div>
            <div className="w-px bg-blue-200/50 hidden md:block"></div>
            <div className="flex-[0.5]">
              <span className="block text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">Max Marks</span>
              <span className="text-slate-800 font-bold">{activeAssignment.maxMarks} pt</span>
            </div>
          </div>
        )}

        <div className="border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Student Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Submitted At</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-center">Timing Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-center bg-blue-50/30">Grade / Raw Mark</th>

                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right text-brand-600">Calculated Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mappedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/50">
                      Processing 0 submissions. No data matched for constraint.
                    </td>
                  </tr>
                ) : (
                  mappedSubmissions.map((sub, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{sub.studentName} <span className="text-slate-400 font-mono text-[10px] block font-normal">{sub.studentRoll}</span></td>
                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                        {formatDate(sub.submittedAt)}
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[220px]">
                          {sub.fileUrl && (
                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-bold rounded-full hover:bg-emerald-100 hover:shadow-sm transition-all group" title={sub.fileUrl}>
                              <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                              <span className="truncate max-w-[100px]">{sub.fileUrl.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                          {sub.fileUrls && sub.fileUrls.map((fileObj, idx) => {
                            const isString = typeof fileObj === 'string';
                            const url = isString ? fileObj : fileObj.url;
                            const fileName = isString 
                              ? (url.split('/').pop() || `File ${idx + 1}`) 
                              : fileObj.name;
                            return (
                              <a key={idx} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200/60 text-blue-700 text-[10px] font-bold rounded-full hover:bg-blue-100 hover:shadow-sm transition-all group" title={fileName}>
                                <FileText size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="truncate max-w-[80px]">{fileName}</span>
                              </a>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sub.penaltyInfo.daysLate > 0 ? (
                          <span className="inline-flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200/60 shadow-sm">
                            <span>{sub.penaltyInfo.daysLate}d Late</span>
                            <span className="bg-red-500 text-white px-1.5 rounded">-{sub.penaltyInfo.penaltyPercentage}%</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60 shadow-sm">
                            <CheckCircle size={14} /> On Time
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 bg-blue-50/10">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number"
                            min="0"
                            placeholder="Score"
                            className="w-20 px-2 py-1.5 text-center font-bold text-slate-800 border border-slate-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-inner"
                            value={editingGrade[sub.id] !== undefined ? editingGrade[sub.id] : (sub.isGraded ? sub.rawMark : '')}
                            onChange={(e) => setEditingGrade({...editingGrade, [sub.id]: e.target.value})}
                          />
                          <button 
                            onClick={() => saveGrade(sub.id)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-sm"
                            title="Save Grade"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1.5 rounded-lg font-bold text-[15px] shadow-sm inline-block min-w-[3rem] text-center ${sub.isGraded ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {sub.isGraded ? sub.finalMarks : '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyView;
