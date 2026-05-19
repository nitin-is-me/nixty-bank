"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return setError('Fill both fields');
    }
    if (username.includes(' ') || password.includes(' ')) {
      return setError('Spaces are not allowed in username or password');
    }

    setLoading(true);

    try {
      const response = await axios.post('https://nixty-bank-hosted-backend.vercel.app/auth/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setError('');
        console.log("Token stored:", response.data.token);
        router.push('/dashboard');
      } else {
        setError('Login failed');
        setMessage('');
      }
    } catch (err) {
      setError(err.response?.data || err.message + ", try again");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center rounded-lg mx-auto mb-2 text-xl font-bold">NB</div>
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>
            Enter your username and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <span className="text-destructive text-sm text-center">{error}</span>
            <span className="text-green-600 text-sm text-center">{message}</span>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Loading...
                </>
              ) : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="underline hover:text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
