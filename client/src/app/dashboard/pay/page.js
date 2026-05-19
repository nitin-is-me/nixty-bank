"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthCheck from '@/app/components/AuthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const TransactionPage = () => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('https://nixty-bank-hosted-backend.vercel.app/auth/userInfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data)
      setName(response.data.name);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setMessage('Could not retrieve user information. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'https://nixty-bank-hosted-backend.vercel.app/transaction/pay',
        {
          receiverAccountNumberOrUsername: recipient,
          amount: parseFloat(amount),
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRecipientName(response.data.receiver.name);
      setBalance(prevBalance => prevBalance - parseFloat(amount));
      setSuccess(true);
    } catch (error) {
      console.error('Error making payment:', error);
      setMessage(error.response?.data || 'Error making payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRepayment = () => {
    setRecipient('');
    setAmount('');
    setDescription('');
    setMessage('');
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-background text-foreground flex flex-col p-4">
          {/* Header with Back Button and Mode Toggle */}
          <div className="flex justify-between items-center mb-6 container mx-auto rounded-lg">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <ModeToggle />
          </div>

          <div className="container mx-auto flex-1 flex items-center justify-center">
            <Card className="max-w-md w-full border-green-500/20 shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-green-500">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">${amount}</strong> has been paid to <strong className="text-foreground">{recipientName}</strong>
                </p>
                <Button onClick={handleRepayment} className="w-full">
                  Make Another Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthCheck>
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
            <h1 className="text-xl font-bold hidden md:block">Make a Payment</h1>
            <ModeToggle />
          </div>
        </div>

        <div className="container mx-auto max-w-2xl space-y-8">
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium uppercase tracking-wider">My Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the recipient and amount below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Username or Account No.</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g. nitin or 1234567890"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="For lunch, Rent, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {message && <p className="text-destructive text-sm text-center font-medium">{message}</p>}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : 'Pay Now'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthCheck>
  );
};

export default TransactionPage;
