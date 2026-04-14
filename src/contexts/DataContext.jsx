import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('adt_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      if (parsed.users && parsed.users.length && parsed.users[0].id === 't1') {
         return { users: [], groups: [], assignments: [], submissions: [], teachers: [] };
      }
      return { teachers: [], ...parsed };
    }
    return {
      users: [],
      teachers: [],
      groups: [],
      assignments: [],
      submissions: []
    };
  });

  
  const refreshStudents = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch('http://localhost:5000/api/users/students'),
        fetch('http://localhost:5000/api/users/teachers')
      ]);
      if (!studentsRes.ok || !teachersRes.ok) throw new Error('Failed to fetch users');
      
      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      
      const mappedStudents = students.map(s => ({ ...s, id: s._id }));
      const mappedTeachers = teachers.map(t => ({ ...t, id: t._id }));
      
      setData(prev => ({ ...prev, users: mappedStudents, teachers: mappedTeachers }));
    } catch (error) {
      console.error('Error fetching real users:', error);
    }
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('adt_data', JSON.stringify(data));
  }, [data]);

  

  const addGroup = (name) => {
    setData(prev => ({
      ...prev,
      groups: [...prev.groups, { id: `g${Date.now()}`, name, students: [], teacherId: user?.id, teacherName: user?.name }]
    }));
  };

  const addStudentToGroup = (groupId, studentId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => {
        if (g.id === groupId && !g.students.includes(studentId)) {
          return { ...g, students: [...g.students, studentId] };
        }
        return g;
      })
    }));
  };

  const addAssignment = (assignmentData) => {
    setData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { id: `a${Date.now()}`, ...assignmentData, teacherId: user?.id, teacherName: user?.name }]
    }));
  };

  const addSubmission = (submissionData) => {
    setData(prev => ({
      ...prev,
      submissions: [...prev.submissions, { id: `sub_${Date.now()}`, ...submissionData }]
    }));
  };

  const gradeSubmission = (submissionId, marksAwarded) => {
    setData(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => 
        s.id === submissionId ? { ...s, marksAwarded: Number(marksAwarded) } : s
      )
    }));
  };

  const deleteSubmission = (submissionId) => {
    setData(prev => ({
      ...prev,
      submissions: prev.submissions.filter(s => s.id !== submissionId)
    }));
  };

  const myGroups = user?.role === 'teacher' 
    ? data.groups.filter(g => g.teacherId === user?.id)
    : data.groups;

  const myAssignments = user?.role === 'teacher'
    ? data.assignments.filter(a => a.teacherId === user?.id)
    : data.assignments;

  return (
    <DataContext.Provider value={{ 
      ...data, 
      teachers: data.teachers || [],
      groups: myGroups,
      assignments: myAssignments,
      addGroup, 
      addStudentToGroup, 
      addAssignment, 
      addSubmission,
      deleteSubmission,
      gradeSubmission,
      refreshStudents
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
