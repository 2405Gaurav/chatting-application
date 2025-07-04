import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ Correct lazy imports using const
const Profile = lazy(() => import('@/pages/profile'));
const Auth = lazy(() => import('@/pages/auth'));
const Chat = lazy(() => import('@/pages/chat'));

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Suspense wraps lazy-loaded routes */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={<Auth />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
