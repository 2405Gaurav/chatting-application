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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10 flex items-center justify-center">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-8">
          <img 
            src={loginImg} 
            alt="Illustration" 
            className="w-full max-w-md object-contain transition-transform hover:scale-105 duration-300" 
          />
        </div>

        {/* Right: Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <img src={Victory} alt="Victory" className="w-16 h-16 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Please enter your details</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {/* Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-5 px-4 rounded-xl"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-5 px-4 rounded-xl"
                      required
                    />
                  </div>
                  <Button className="w-full mt-4 py-5 rounded-xl" type="submit">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Register */}
              <TabsContent value="register">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-5 px-4 rounded-xl"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-5 px-4 rounded-xl"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-5 px-4 rounded-xl"
                      required
                    />
                  </div>
                  <Button className="w-full mt-4 py-5 rounded-xl" type="submit" variant="default">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Auth;