export const users = [
  { id: 't1', name: 'Dr. Smith', role: 'teacher', email: 'teacher@demo.com', password: 'password123' },
  { id: 's1', name: 'Alice Johnson', role: 'student', roll: '101', email: 'alice@demo.com', password: 'password123' },
  { id: 's2', name: 'Bob Williams', role: 'student', roll: '102', email: 'bob@demo.com', password: 'password123' },
  { id: 's3', name: 'Charlie Brown', role: 'student', roll: '103', email: 'charlie@demo.com', password: 'password123' }
];

export const initialGroups = [
  { id: 'g1', name: 'Computer Science 101', students: ['s1', 's2'] },
  { id: 'g2', name: 'Advanced Mathematics', students: ['s2', 's3'] }
];

export const initialAssignments = [
  {
    id: 'a1',
    title: 'React Fundamentals',
    description: 'Build a basic counter application.',
    groupId: 'g1',
    
    deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    penaltyRate: 10, 
    maxMarks: 100
  },
  {
    id: 'a2',
    title: 'Algebra Quiz',
    description: 'Solve the provided equations.',
    groupId: 'g2',
    
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    penaltyRate: 5,
    maxMarks: 50
  }
];

export const initialSubmissions = [
  { id: 'sub1', assignmentId: 'a1', studentId: 's1', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), fileUrl: 'demo.zip', marksAwarded: 90 }, 
  { id: 'sub2', assignmentId: 'a1', studentId: 's2', submittedAt: new Date().toISOString(), fileUrl: 'demo2.zip', marksAwarded: 85 } 
];
