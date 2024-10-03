const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
    const { username, name, password } = req.body;
    if (await Account.findOne({ username: username })) {
        res.send("Username already exists!");
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);
    let accountNumber;
    const generateAccountNumber = () =>{
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    do{
      accountNumber = generateAccountNumber();
    } while(await Account.exists({code: accountNumber}));
    const usertoadd = new Account({ username, name, password: hash, accountNumber});
    const addeduser = await usertoadd.save();
    console.log(addeduser)
    res.status(200).send("Account created successfully")
    // res.send(addeduser);
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Account.findOne({ username });
        if (!user) {
            return res.send("Username doesn't exist, try signing up instead");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {

            const token = jwt.sign({ username: user.username, name: user.name }, process.env.JWT_SECRET, { expiresIn: '2h' });


            res.cookie("tokentwo", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV=="production",
                sameSite: "strict",
                expires: new Date((Date.now() + 3600000)*24)
            });

            return res.send("Logged in successfully");
        } else {
            return res.send("Wrong password, try again");
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.send("Internal server error");
    }
}

exports.logout = async (req, res) => {
    res.cookie("tokentwo", '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: '/'
    });
    res.send("Logging you out...");
}

exports.getAll = async (req, res)=>{
    const usertofind = await Account.find();
    res.send(usertofind)
}

exports.verifyToken = async (req, res) => {
    const token = req.cookies.tokentwo;
    if (!token) {
        return res.send('User is unauthorized');
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).send('User is authorized');
    } catch (error) {
        return res.status(401).send('User is unauthorized');
    }
}

exports.userInfo = async(req, res)=>{
    const token = req.cookies.tokentwo;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const foundUser = await Account.findOne({username});
    const name = foundUser.name;
    const balance = foundUser.balance;
    const accountNumber = foundUser.accountNumber;
    res.json({name, username, balance, accountNumber});
}
