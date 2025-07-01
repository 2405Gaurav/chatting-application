import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Victory from '@/assets/victory.svg'
import login from '@/assets/login2.png'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) {
      alert('Please fill all fields')
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    // signup logic
    console.log('Registering:', { email, password })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    // login logic
    console.log('Logging in:', { email, password })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 xl:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col items-center justify-center px-6 py-12 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Welcome</h1>
            <img src={Victory} alt="Welcome" className="w-24 h-24 object-contain" />
            <p className="text-muted-foreground max-w-xs text-sm">
              Enter your credentials to start chatting with people around the world.
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="login" className="w-full max-w-sm">
            <TabsList className="grid w-full grid-cols-2 bg-accent">
              <TabsTrigger value="login" className="rounded-l-md">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-r-md">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form className="space-y-4 mt-4" onSubmit={handleLogin}>
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
              <form className="space-y-4 mt-4" onSubmit={handleSignup}>
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

        {/* Right Column with only ONE illustration */}
        <div className="hidden xl:flex items-center justify-center bg-muted">
          <img src={login} alt="Chat Illustration" className="w-[70%] object-contain" />
        </div>
      </div>
    </div>
  )
}

export default Auth
