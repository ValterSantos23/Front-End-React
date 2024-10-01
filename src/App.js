import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UserList from './components/UserList.js';
import CreateUserForm from './components/CreateUserForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<CreateUserForm />} />
      </Routes>
    </Router>
  );
};

export default App;
