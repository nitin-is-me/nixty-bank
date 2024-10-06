"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
      const response = await axios.get('http://localhost:8000/auth/userInfo', {
        withCredentials: true,
      });
      setName(response.data.name);
      setBalance(response.data.balance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/transaction/pay',
        {
          receiverAccountNumberOrUsername: recipient,
          amount: parseFloat(amount),
          description,
        },
        { withCredentials: true }
      );

      setMessage('');
      setRecipientName(response.data.receiver.name);
      setSuccess(true);
    } catch (error) {
      console.error('Error making payment:', error);
      setMessage(error.response?.data || 'Error making payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRepayment = async () => {
    setRecipient('');
    setAmount('');
    setDescription('');
    setMessage('');
    setSuccess(false);

    setLoading(true);
    await fetchUserInfo();
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mt-5 text-center">
        <button
          className="btn btn-secondary position-fixed"
          onClick={() => router.push('/dashboard')}
          style={{
            top: '1rem',
            left: '1rem',
            zIndex: 1000,
          }}
        >
          <i className="bi bi-arrow-left"></i> Dashboard
        </button>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <div className="card-body">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: '4rem' }}
                ></i>
                <h1 className="text-success mt-3">Payment Successful!</h1>
                <p className="mt-2">
                  <strong>${amount}</strong> has been paid to{' '}
                  <strong>{recipientName}</strong>
                </p>
                <button className="btn btn-primary mt-3" onClick={handleRepayment}>
                  Make Another Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-3">
      <button
        className="btn btn-secondary position-fixed"
        onClick={() => router.push('/dashboard')}
        style={{
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
        }}
      >
        <i className="bi bi-arrow-left"></i> Dashboard
      </button>
      
      <div className="row mt-4">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm p-4 text-center">
            <h3>My Balance</h3>
            <h1 className="text-success">${balance.toFixed(2)}</h1>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header">
              <h4 className="mb-0">Make a Payment</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label htmlFor="recipient" className="form-label">
                    Recipient Username or Account No.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <span className="text-danger mb-2 w-100">{message}</span>
                <button type="submit" className="btn mt-2 btn-primary w-100" disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Pay'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
