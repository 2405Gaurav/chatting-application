import React from 'react'
import { useAppStore } from '@/store/index.js'

function Profile() {
  const {userInfo}=useAppStore()
  return (
    <div className='text-4xl text-black'>Profile
    
    <div>Email:{userInfo.email}</div>
    <div>Name:{userInfo.name}</div>
    <div>Profile Setup:{userInfo.profileSetup}</div>
    </div>

  )
}

export default Profile