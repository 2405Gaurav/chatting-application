import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const Profile = lazy(() => import('@/pages/profile'));
const Auth = lazy(() => import('@/pages/auth'));
const Chat = lazy(() => import('@/pages/chat'));

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return !userInfo ? children : <Navigate to="/chat" />;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const getUserData = async () => {
    try {
      const response = await apiClient.get(GET_USER_INFO); // no need to pass again if set globally
      if (response.status === 200 && response.data?.id) {
        setUserInfo(response.data);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUserInfo(undefined); // not logged in — normal
      } else {
        console.error("Unexpected error getting user info:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  getUserData();
}, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/*" element={<Auth />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
