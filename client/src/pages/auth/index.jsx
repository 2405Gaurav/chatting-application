import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Victory from '@/assets/victory.svg'
import login from '@/assets/login2.png'
import { Toaster, toast } from 'sonner'
import { apiClient } from '@/lib/api-client.js'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { SIGNUP, LOGIN } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/index.js'

function Auth() {
  const navigate = useNavigate()
  const { setUserInfo } = useAppStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateSignup = () => {
    if (!email.length) {
      toast.error('Email is required')
      return false
    }
    if (!password.length || !confirmPassword.length) {
      toast.error('Password and Confirm Password are required')
      return false
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const validateLogin = () => {
    if (!email.length) {
      toast.error('Email is required')
      return false
    }
    if (!password.length) {
      toast.error('Password is required')
      return false
    }
    return true
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateSignup()) return

    try {
      const response = await apiClient.post(SIGNUP, { email, password }, { withCredentials: true })
      const user = response?.data?.user

      if (response?.status === 201 && user) {
        setUserInfo(user)
        toast.success('Signup successful!')
        navigate('/profile')
      } else {
        toast.error('Signup failed. Please try again.')
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error('User already exists. Please log in.')
      } else {
        console.error('Signup error:', error)
        toast.error('Something went wrong during signup.')
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return

    try {
      const response = await apiClient.post(LOGIN, { email, password }, { withCredentials: true })
      const user = response?.data?.user

      if (response?.status === 200 && user?.id) {
        setUserInfo(user)
        toast.success('Login successful!')

        if (user.profileSetup) {
          navigate('/chat')
        } else {
          navigate('/profile')
        }
      } else {
        toast.error('Invalid credentials or server response.')
        console.log(response)
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Invalid email or password.')
      } else {
        console.error('Login error:', error)
        toast.error('Something went wrong during login.')
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-muted px-4 py-10 flex items-center justify-center">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* Left: Illustration */}
        <div className="w-full md:w-1/2 bg-muted flex items-center justify-center p-6">
          <img src={login} alt="Chat Illustration" className="w-[80%] object-contain" />
        </div>

        {/* Right: Form & Tabs */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10 gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <img src={Victory} alt="Victory" className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground text-sm max-w-xs">
              Enter your credentials to start chatting with people around the world.
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={handleLogin}>
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-full mt-2" type="submit">Login</Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form className="space-y-4" onSubmit={handleSignup}>
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="w-full mt-2" type="submit" variant="secondary">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Auth
