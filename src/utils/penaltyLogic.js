
export const calculatePenalty = (deadline, submitDate, penaltyRate) => {
  const deadlineDate = new Date(deadline);
  const submittedDate = new Date(submitDate);

  
  if (submittedDate <= deadlineDate) {
    return { daysLate: 0, penaltyPercentage: 0, finalScoreMultiplier: 1 };
  }

  
  const diffTime = Math.abs(submittedDate - deadlineDate);
  
  const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  
  const totalPenaltyPct = Math.min(daysLate * penaltyRate, 100);
  
  return {
    daysLate,
    penaltyPercentage: totalPenaltyPct,
    finalScoreMultiplier: (100 - totalPenaltyPct) / 100
  };
};


export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


export const isPastDue = (deadline) => {
  return new Date() > new Date(deadline);
};
