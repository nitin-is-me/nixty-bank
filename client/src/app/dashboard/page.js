"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthCheck from "../components/AuthCheck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const router = useRouter();

  const overallLoading = userLoading || transactionsLoading;

  const fetchUserInfo = async (token) => {
    try {
      const res = await axios.get(
        "https://nixty-bank-hosted-backend.vercel.app/auth/userInfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(res.data);
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching user info:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      }
    } finally {
      setUserLoading(false);
    }
  };

  const fetchTransactions = async (token) => {
    try {
      const res = await axios.get(
        "https://nixty-bank-hosted-backend.vercel.app/transaction/getTransactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      }
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserLoading(false);
        setTransactionsLoading(false);
        router.replace("/auth/login");
        return;
      }
      await fetchUserInfo(token);
      await fetchTransactions(token);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      localStorage.removeItem("token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLoadingLogout(false);
    }
  };

  const handlePayClick = () => {
    setLoadingPayment(true);
    router.push("/dashboard/pay");
  };

  if (overallLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userInfo || balance === null) {
    // Fallback if not redirected yet
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground gap-4">
        <h3 className="text-xl">You are not logged in</h3>
        <Button onClick={() => router.push("/auth/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md font-bold text-lg">NB</div>
              <h1 className="text-lg font-bold">Nixty Bank</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:inline-block">Welcome, {userInfo.name}</span>
              <ModeToggle />
              <Button variant="destructive" size="sm" onClick={handleLogout} disabled={loadingLogout}>
                {loadingLogout ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Balance</CardTitle>
                  <CardDescription>Available funds in your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    ${balance.toFixed(2)}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Account No: <span className="font-mono text-foreground font-medium">{userInfo.accountNumber}</span></div>
                    <div>Email: <span className="text-foreground">{userInfo.email}</span></div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePayClick} disabled={loadingPayment}>
                    {loadingPayment ? "Loading..." : "Pay to Account"}
                  </Button>
                </div>
              </Card>
            </div>

            <div className="h-[calc(100vh-12rem)] min-h-[500px]">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0">
                  <div className="divide-y text-card-foreground">
                    {transactions.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">No transactions found.</div>
                    ) : transactions.map((t) => {
                      const isSender = t.sender.username === userInfo.username;
                      const dateObj = new Date(t.date);
                      const formattedDate = dateObj.toLocaleDateString() + " - " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={t._id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium text-sm leading-none">{t.description}</p>
                            <p className="text-xs text-muted-foreground">{formattedDate}</p>
                            <p className="text-xs text-muted-foreground">{isSender ? `To ${t.receiver.name}` : `From ${t.sender.name}`}</p>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${isSender ? "text-destructive" : "text-green-600"}`}>
                              {isSender ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                            </div>
                            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push(`/dashboard/transaction/${t._id}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default Dashboard;
