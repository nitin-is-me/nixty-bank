"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import AuthCheck from '@/app/components/AuthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const TransactionDetails = () => {
  const params = useParams();
  const { id } = params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://nixty-bank-hosted-backend.vercel.app/transaction/getTransaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransaction(response.data);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setError('Could not fetch transaction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-destructive">
        <p>Transaction not found.</p>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4">

        {/* Header with Back Button and Mode Toggle */}
        <div className="flex justify-between items-center mb-6 container mx-auto rounded-lg">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold hidden md:block">Transaction Details</h1>
            <ModeToggle />
          </div>
        </div>

        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className='text-center text-3xl font-bold mb-8 md:hidden'>Transaction Details</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sender's Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong className="font-semibold">Name:</strong> {transaction.sender.name}</p>
                <p><strong className="font-semibold">Username:</strong> {transaction.sender.username}</p>
                <p><strong className="font-semibold">Account No:</strong> {transaction.sender.accountNumber}</p>
                <p><strong className="font-semibold">Email:</strong> {transaction.sender.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receiver's Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong className="font-semibold">Name:</strong> {transaction.receiver.name}</p>
                <p><strong className="font-semibold">Username:</strong> {transaction.receiver.username}</p>
                <p><strong className="font-semibold">Account No:</strong> {transaction.receiver.accountNumber}</p>
                <p><strong className="font-semibold">Email:</strong> {transaction.receiver.email}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong className="block text-sm font-medium text-muted-foreground">Date</strong>
                <p>{new Date(transaction.date).toLocaleString()}</p>
              </div>
              <div>
                <strong className="block text-sm font-medium text-muted-foreground">Amount Paid</strong>
                <p className="text-2xl font-bold">${transaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <strong className="block text-sm font-medium text-muted-foreground">Description</strong>
                <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: transaction.description }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthCheck>
  );
};

export default TransactionDetails;
