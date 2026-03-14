import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Project from '../screens/Project';
import UserAuth from '../auth/UserAuth';
import Landing from '../screens/Landing';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<UserAuth><Home /></UserAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
