"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !name || !password || !email || username.trim() === "" || name.trim() === "" || password.trim() === "" || email.trim() === "") {
      setMessage("");
      return setError("Fill all the fields");
    }
    if (username.includes(" ") || password.includes(" ") || email.includes(" ")) {
      setMessage("");
      return setError("Spaces are not allowed in username, password, or email");
    }

    setLoadingSignup(true);

    try {
      const response = await axios.post("https://nixty-bank-hosted-backend.vercel.app/auth/signup", { username, name, password, email });
      if (response.data === "OTP sent to your mail") {
        setShowOtpForm(true);
        setError("");
        setMessage(response.data);
      } else {
        setError(response.data);
        setMessage("");
      }
    } catch (error) {
      setError(error.response?.data || "An error occured");
      setMessage("");
    } finally {
      setLoadingSignup(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim() === "") {
      return setError("Please enter the OTP");
    }

    setLoadingOtp(true);

    try {
      const response = await axios.post("https://nixty-bank-hosted-backend.vercel.app/auth/verifyOtp", { username, otp });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setMessage("Account created successfully, redirecting...");
        setError("");
        router.push("/dashboard");
      } else {
        setError(response.data);
        setMessage("");
      }
    } catch (error) {
      setError(error.response?.data || "An error occurred while verifying OTP");
      setMessage("");
    } finally {
      setLoadingOtp(false);
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
          <CardTitle className="text-2xl">{showOtpForm ? "Verify OTP" : "Sign Up"}</CardTitle>
          <CardDescription>
            {showOtpForm ? "Enter the OTP sent to your email" : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtpForm ? (
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <span className="text-destructive text-sm text-center">{error}</span>
              <span className="text-green-600 text-sm text-center">{message}</span>
              <Button type="submit" className="w-full" disabled={loadingSignup}>
                {loadingSignup ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Signing Up...
                  </>
                ) : 'Sign Up'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <span className="text-destructive text-sm text-center">{error}</span>
              <span className="text-green-600 text-sm text-center">{message}</span>
              <Button type="submit" className="w-full" disabled={loadingOtp}>
                {loadingOtp ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </Button>
            </form>
          )}
        </CardContent>
        {!showOtpForm && (
          <CardFooter className="flex flex-col gap-2">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline hover:text-primary">
                Login
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
