import React, { Children, lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';


// lazy imports using const
const Profile = lazy(() => import('@/pages/profile'));
const Auth = lazy(() => import('@/pages/auth'));
const Chat = lazy(() => import('@/pages/chat'));
 
const PrivateRoute=({Children})=>{
  const {userInfo}=useAppStore();
  const isAuthenticated=!!userInfo;
  return isAuthenticated? Children: <Navigate to="/auth"/>;
}
const AuthRoute=({Children})=>{
  const {userInfo,setUserInfo}=useAppStore();
  const isAuthenticated=!!userInfo;
  return isAuthenticated? <Navigate to="/chat"/>: Children;
}
function App() {
  const {userInfo}=useAppStore();
  const [loading,setLoading]=useState(true);


  useEffect(()=>{
    const getUserData= async ()=>{
      try{
        const response=await apiClient.get(GET_USER_INFO,{withCredentials:true})
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log(response);
    }catch(error){
      setUserInfo(undefined);
    }finally{
      setLoading(false);
    }


      if(!userInfo){
        getUserData();
      }else{
        setLoading(false);
      }
      if(loading){
        return <div>Loading...</div>
      }



    



  }},[]);
  return (
    <BrowserRouter>
      {/*  wraps lazy-loaded routes */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/profile" element={ <PrivateRoute> <Profile /> </PrivateRoute>} />
          <Route path="/chat" element={ <PrivateRoute> <Chat /> </PrivateRoute>} />
          <Route path="/auth" element={ <AuthRoute> <Auth /> </AuthRoute> } />
          <Route path="/*" element={<Auth />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
