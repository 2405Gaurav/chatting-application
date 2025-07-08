import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Chat() {
  const {userInfo}=useAppStore();
  const navigate=useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast.message("setup Profile to continue")
      navigate('/profile');
    }


  },[userInfo,navigate])
  return (
    <div>chat</div>
  )
}

export default Chat
