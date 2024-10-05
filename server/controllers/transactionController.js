const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
exports.pay = async (req, res) => {
    try {
      const { receiverAccountNumberOrUsername, amount, description } = req.body;
      const token = req.cookies.tokentwo;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
  
      const senderAccount = await Account.findOne({ username });
      const senderId = senderAccount._id;
  
      if (!senderId) {
        return res.status(404).send('Sender not found');
      }
  
      let receiverAccount;
      
      receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumberOrUsername });
  
      if (!receiverAccount) {
        receiverAccount = await Account.findOne({ username: receiverAccountNumberOrUsername });
      }
  
      if (!receiverAccount) {
        return res.status(404).send('Receiver not found');
      }
  
      if (senderAccount.balance < amount) {
        return res.status(400).send("Insufficient balance");
      }
      if(senderAccount.accountNumber==receiverAccount.accountNumber){
        return res.status(400).send("Self transfer is prohibted");
      }
  
      const transaction = new Transaction({
        sender: senderId,
        receiver: receiverAccount._id,
        amount,
        description
      });
  
      await transaction.save();
      senderAccount.balance -= amount;
      receiverAccount.balance += amount;
      await senderAccount.save();
      await receiverAccount.save();
  
      return res.status(200).json({
        message: "Payment Successful",
        receiver: {
          username: receiverAccount.username,
          name: receiverAccount.name
        }
      });
    } catch (error) {
      console.log("Error creating transaction: ", error);
      return res.status(500).send("Internal server error");
    }
  };

exports.getTransactions = async(req, res) =>{
    try {
        const token = req.cookies.tokentwo;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
    
        // Find the user's account
        const userAccount = await Account.findOne({ username });
        if (!userAccount) {
          return res.status(404).send('User not found');
        }
    
        const transactions = await Transaction.find({
          $or: [
            { sender: userAccount._id },
            { receiver: userAccount._id }
          ]
        }).populate('sender receiver', 'username name');
    
        return res.status(200).json(transactions);
      } catch (error) {
        console.log("Error fetching transactions: ", error);
        return res.status(500).send("Internal server error");
      }
}

exports.getTransaction = async(req, res)=>{
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('sender', 'username accountNumber name email')
      .populate('receiver', 'username accountNumber name email');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
