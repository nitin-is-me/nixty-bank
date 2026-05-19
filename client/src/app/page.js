"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar / Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-md font-bold text-xl">NB</div>
            <h1 className="text-xl font-bold">Nixty Bank</h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome to Nixty Bank
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Nixty Bank is your reliable partner for managing your finances.
          We provide a seamless banking experience with secure transactions,
          easy access to your accounts, which is really fast and secure.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Fast & Secure Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Experience quick transactions with top-notch security.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pay with Ease</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pay either using username or account number for your convenience.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Check transaction history</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You can check detailed information of a specific transaction.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-x-4">
          {!loading && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Your Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button size="lg">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" size="lg">Register</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Made by <a href="https://github.com/nitin-is-me" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Nitin</a></p>
      </footer>
    </div>
  );
}
