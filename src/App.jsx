import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import TeacherOverview from './pages/TeacherDashboard/Overview';
import GroupManagement from './pages/TeacherDashboard/GroupManagement';
import AssignmentForm from './pages/TeacherDashboard/AssignmentForm';
import PenaltyView from './pages/TeacherDashboard/PenaltyView';
import UpcomingAssignments from './pages/StudentDashboard/UpcomingAssignments';
import AssignmentView from './pages/StudentDashboard/AssignmentView';
import MyGroups from './pages/StudentDashboard/MyGroups';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Home /> : <Navigate to="/" />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={
            user?.role === 'teacher' ? <Navigate to="/teacher/overview" /> : 
            user?.role === 'student' ? <Navigate to="/student/groups" /> : 
            <Navigate to="/login" />
          } />

          {}
          <Route path="teacher">
            <Route path="overview" element={<TeacherOverview />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="assignments/new" element={<AssignmentForm />} />
            <Route path="penalties" element={<PenaltyView />} />
          </Route>

          {}
          <Route path="student">
            <Route path="groups" element={<MyGroups />} />
            <Route path="assignments" element={<UpcomingAssignments />} />
            <Route path="assignments/:id" element={<AssignmentView />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
