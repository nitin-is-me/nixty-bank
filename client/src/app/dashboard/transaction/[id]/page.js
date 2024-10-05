"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const TransactionDetails = ({ params }) => {
  const { id } = params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/transaction/getTransaction/${id}`, { withCredentials: true });
        setTransaction(response.data);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return <div>Transaction not found.</div>;
  }

  return (
    <div className="container mt-5">
      <button
        className="btn btn-secondary mb-3 position-fixed"
        onClick={() => router.push('/dashboard')}
        style={{
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
        }}
      >
        <i className="bi bi-arrow-left"></i> Dashboard
      </button>
      <h1 className='text-center mb-4'>Transaction Details</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Sender's Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {transaction.sender.name}</p>
              <p><strong>Username:</strong> {transaction.sender.username}</p>
              <p><strong>Account No:</strong> {transaction.sender.accountNumber}</p>
              <p><strong>Email:</strong> {transaction.sender.email}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Receiver's Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {transaction.receiver.name}</p>
              <p><strong>Username:</strong> {transaction.receiver.username}</p>
              <p><strong>Account No:</strong> {transaction.receiver.accountNumber}</p>
              <p><strong>Email:</strong> {transaction.receiver.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h5>Transaction Details</h5>
        </div>
        <div className="card-body">
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
          <p><strong>Description:</strong> {transaction.description}</p>
          <p><strong>Amount Paid:</strong> ${transaction.amount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
