// src/pages/auth.jsx

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Victory from '@/assets/victory.svg';
import loginImg from '@/assets/login2.png';
import { Toaster, toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { SIGNUP, LOGIN } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

function Auth() {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email || !password) {
      toast.error('Email and Password are required');
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      const res = await apiClient.post(SIGNUP, { email, password }, { withCredentials: true });
      const user = res?.data?.user;

      if (res.status === 201 && user) {
        setUserInfo(user);
        toast.success('Signup successful!');
        navigate('/profile');
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error('User already exists. Try logging in.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const res = await apiClient.post(LOGIN, { email, password }, { withCredentials: true });
      const user = res?.data?.user;

      if (res.status === 200 && user?.id) {
        setUserInfo(user);
        toast.success('Login successful!');
        user.profileSetup ? navigate('/chat') : navigate('/profile');
      } else {
        toast.error('Invalid login response');
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Invalid credentials');
      } else {
        toast.error('Login failed. Try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-muted px-4 py-10 flex items-center justify-center">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-muted flex items-center justify-center p-6">
          <img src={loginImg} alt="Illustration" className="w-[80%]" />
        </div>

        {/* Right: Auth Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center gap-6">
          <div className="text-center">
            <img src={Victory} alt="Victory" className="w-16 h-16 mx-auto" />
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-sm">Login or register to continue</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                   autoComplete="current-password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button className="w-full mt-2" type="submit">Login</Button>
              </form>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button className="w-full mt-2" type="submit" variant="secondary">Register</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Auth;
