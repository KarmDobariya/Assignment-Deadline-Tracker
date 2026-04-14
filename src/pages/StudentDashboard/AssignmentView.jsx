import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { formatDate, isPastDue, calculatePenalty } from '../../utils/penaltyLogic';
import { AlertTriangle, UploadCloud, CheckCircle2, ArrowLeft, Send, FileText, Download, RotateCcw, CheckCircle } from 'lucide-react';

const AssignmentView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { assignments, submissions, addSubmission, deleteSubmission } = useData();
  const navigate = useNavigate();
  
  const assignment = assignments.find(a => a.id === id);
  const existingSubmission = submissions.find(s => s.assignmentId === id && s.studentId === user.id);

  const [fileUrl, setFileUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  if (!assignment) {
    return <div className="text-center p-16 text-slate-500 font-display text-xl font-bold">Assignment context not found.</div>;
  }

  const pastDue = isPastDue(assignment.deadline);

  const isGraded = !!existingSubmission?.marksAwarded;
  let finalScore = null;
  let rawScore = null;
  let penaltyApplied = null;

  if (isGraded) {
    rawScore = existingSubmission.marksAwarded;
    const penaltyInf = calculatePenalty(assignment.deadline, existingSubmission.submittedAt, assignment.penaltyRate);
    finalScore = Number((rawScore * penaltyInf.finalScoreMultiplier).toFixed(2));
    penaltyApplied = penaltyInf.penaltyPercentage;
  }

  const canUndo = !isGraded && !pastDue;

  const handleUndo = () => {
    if (window.confirm("Are you sure you want to retract your submission? This action cannot be reversed.")) {
      deleteSubmission(existingSubmission.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl && files.length === 0) {
      alert("Please provide a link or select files to submit.");
      return;
    }

    setIsSubmitting(true);
    let uploadedUrls = [];

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      try {
        const res = await fetch('http://localhost:5000/api/upload/multiple', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls = data.urls || [];
        } else {
          throw new Error('Server returned ' + res.status);
        }
      } catch (err) {
        console.error('File upload failed', err);
        alert("Failed to upload files. Please ensure the backend server is running.");
        setIsSubmitting(false);
        return;
      }
    }

    addSubmission({
      assignmentId: id,
      studentId: user.id,
      submittedAt: new Date().toISOString(),
      fileUrl: fileUrl,
      fileUrls: uploadedUrls,
      marksAwarded: 0 
    });

    setIsSubmitting(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      navigate('/student/assignments');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up relative z-10">

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-emerald-100 animate-slide-up">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-800 mb-2">Submission Successful!</h3>
            <p className="text-slate-500 mb-6">Your assignment has been securely transmitted and verified.</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_2.5s_ease-in-out]" style={{ animationFillMode: 'forwards' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[30rem] bg-brand-100/40 rounded-full blur-[100px] opacity-50 -z-10 pointer-events-none mix-blend-multiply"></div>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors font-bold tracking-wide uppercase px-4 py-2 bg-white/50 rounded-full border border-slate-200/50 shadow-sm backdrop-blur w-fit"
      >
        <ArrowLeft size={16} /> Previous Directory
      </button>

      <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
        
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

        <div className="border-b border-slate-200/60 pb-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-800 mb-6 tracking-tight leading-tight">{assignment.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-gradient-to-r from-blue-50 to-brand-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100/50 shadow-sm flex items-center gap-2">
              Maximum Value <span className="bg-white px-2 py-0.5 rounded shadow-sm">{assignment.maxMarks} pt</span>
            </span>
            <span className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border shadow-sm ${pastDue ? 'bg-red-50 text-red-700 border-red-200/50' : 'bg-slate-50 text-slate-700 border-slate-200/60'}`}>
              Due Target <span className="bg-white px-2 py-0.5 rounded shadow-sm">{formatDate(assignment.deadline)}</span>
            </span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-10 prose-p:text-slate-600 prose-headings:font-display prose-headings:text-slate-800">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2 before:w-6 before:h-px before:bg-slate-300">Technical Instructions</h3>
          <p className="whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">{assignment.description}</p>
          
          {assignment.attachmentUrl && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50/80 to-white border border-blue-100/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_12px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100/50">
                  <FileText className="text-blue-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-[15px] m-0 leading-tight">Instructor Reference Attachment</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 m-0">Review required before submission</p>
                </div>
              </div>
              <a 
                href={assignment.attachmentUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center sm:w-auto w-full gap-2 bg-white hover:bg-blue-600 hover:text-white text-blue-600 font-bold px-6 py-3 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200 text-sm group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Download File
              </a>
            </div>
          )}
        </div>

        {existingSubmission ? (
          <div className="bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200/50 p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200/30 rounded-bl-full filter blur-xl"></div>
            
            <div className="p-4 bg-white/60 rounded-full shadow-sm md:shrink-0 backdrop-blur-sm mt-1">
              <CheckCircle2 className="text-brand-500" size={36} />
            </div>
            <div className="text-center md:text-left relative z-10 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-800 tracking-tight">Submission Verified & Stored</h3>
                  <p className="text-slate-600 text-[15px] mt-2">
                    Our servers successfully captured your assignment package on <strong>{formatDate(existingSubmission.submittedAt)}.</strong>
                  </p>
                </div>
                {canUndo && (
                  <button 
                    onClick={handleUndo}
                    className="shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 font-bold px-4 py-2.5 rounded-xl border border-red-200 shadow-sm transition-all text-sm"
                  >
                    <RotateCcw size={16} />
                    Undo Submission
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {existingSubmission.fileUrl && (
                  <a href={existingSubmission.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold rounded-full hover:bg-emerald-100 transition-colors group shadow-sm">
                    <UploadCloud size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="truncate max-w-[200px]">{existingSubmission.fileUrl.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                
                {existingSubmission.fileUrls && existingSubmission.fileUrls.map((fileObj, i) => {
                  const isString = typeof fileObj === 'string';
                  const url = isString ? fileObj : fileObj.url;
                  const fileName = isString ? `File Attachment ${i + 1}` : fileObj.name;
                  return (
                    <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-100 transition-colors group shadow-sm"
                    >
                      <FileText size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="truncate max-w-[150px]">{fileName}</span>
                    </a>
                  );
                })}
              </div>
              
              {isGraded && (
                <div className="mt-6 border-t border-brand-200/40 pt-6">
                  <div className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-brand-200/50 shadow-sm group hover:border-brand-300 transition-colors">
                    <div className="px-4 py-2 bg-gradient-to-br from-brand-100 to-blue-100 border border-brand-200/50 rounded-xl text-center shadow-sm">
                      <div className="text-brand-700 font-black text-2xl tracking-tight leading-none">{finalScore}</div>
                      <div className="text-[10px] uppercase font-bold text-brand-500 mt-1">/ {assignment.maxMarks} pt</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px]">Evaluation Complete</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-medium">Raw Points:</span> {rawScore}
                        {penaltyApplied > 0 && <span className="text-red-600 font-bold ml-2 underline decoration-red-200 underline-offset-2">-{penaltyApplied}% Late Deduction</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200/60 pt-8 mt-4">
            {pastDue && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-r-2xl mb-8 flex flex-col sm:flex-row items-start gap-4 text-orange-900 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-full bg-red-500/10 filter blur-2xl group-hover:bg-red-500/20 transition-all duration-1000"></div>
                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm sm:shrink-0 text-orange-600">
                  <AlertTriangle size={28} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold font-display text-lg tracking-tight">Imminent Penalty Warning</h4>
                  <p className="text-[15px] mt-1 leading-relaxed opacity-90">This assessment has passed the global deadline. Processing this form now applies a <strong>{assignment.penaltyRate}% automated deduction block per day late.</strong></p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-inner">
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-[15px] font-bold text-slate-700 mb-2">Secure Drop Zone (Link or Identifier)</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm font-medium placeholder:text-slate-400"
                      placeholder="e.g. github.com/username/project.git"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                    />
                    <UploadCloud size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-slate-700 mb-2">File Attachments</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm font-medium text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-100/50 text-brand-700 text-xs font-bold rounded-full">
                          <FileText size={12} />
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none tracking-wide text-lg"
              >
                {isSubmitting ? (
                  <span className="animate-pulse tracking-widest">Processing Data...</span>
                ) : (
                  <>
                    <span>Transmit Final Package</span>
                    <Send size={18} className="translate-y-px group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentView;
