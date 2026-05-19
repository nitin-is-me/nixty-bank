"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const AuthCheck = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                await axios.post('https://nixty-bank-hosted-backend.vercel.app/auth/verifyToken', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground gap-4">
                <h2 className="text-2xl font-bold">You're not logged in</h2>
                <Button onClick={() => router.push('/auth/login')}>
                    Login
                </Button>
            </div>
        );
    }

    return children;
};

export default AuthCheck;
