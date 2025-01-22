import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Zone2Dashboard from './pages/Zone2Dashboard';
import Zone3Dashboard from './pages/Zone3Dashboard';
import FormPage from './pages/FormPage';
import FormPage2 from './pages/Zone2Form';
import FormPage3 from './pages/Zone3Form';
import CreateUserPage from './pages/CreateUserPage';
import DisplayPage from './pages/DisplayPage';
import UpdatePage from './components/Update';
 // Helper for checking authentication

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/zone1dashboard"
          element={<Dashboard />}
        />
                <Route
          path="/zone2dashboard"
          element={<Zone2Dashboard />}
        />
                        <Route
          path="/zone3dashboard"
          element={<Zone3Dashboard />}
        />
        <Route
          path="/zone1"
          element={ <FormPage /> }
        />
        <Route
          path="/zone2"
          element={ <FormPage2 /> }
        />
        <Route
          path="/zone3"
          element={ <FormPage3 /> }
        />
        <Route
          path="/create-user"
          element={ <CreateUserPage /> }
        />
        <Route
          path="/display"
          element={ <DisplayPage />}
        />
        <Route path="/edit-session/:sessionId/:Role" element={<UpdatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
