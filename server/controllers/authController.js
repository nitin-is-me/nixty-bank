const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const tempUsers = {};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const sendOtpEmail = async (email, otp) => {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Change this to your email service
        auth: {
            user: "nitinjha2609@gmail.com", // Your email address
            pass: "jnaqoiivnkgwgoeq", // Your email password or app password
        },
    });

    const mailOptions = {
        from: "nitinjha2609@gmail.com",
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

exports.signup = async (req, res) => {
    const { username, name, password, email } = req.body;
    if (await Account.findOne({ username: username })) {
        res.send("Username already exists!");
        return
    }
    if (await Account.findOne({ email: email })) {
        res.send("Email already in use");
        return
    }

    const otp = generateOtp();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    tempUsers[username] = { username, name, password, email, otp, otpExpiration };
    try {
        await sendOtpEmail(email, otp);
        console.log("OTP send to:", email);
        res.status(200).send("OTP sent to your mail");
    } catch (error) {
        console.log("Error sending OTP:", error);
        res.status(500).send("Error sending OTP, please try again");
    }
    // res.send(addeduser);
}

exports.verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    const tempUser = tempUsers[username];
    if (!tempUser) {
        return res.send("User not found or OTP not requested");
    }

    if (tempUser.otpExpiration < Date.now()) {
        delete tempUsers[username];
        return res.send("OTP has expired");
    }
    console.log("Stored OTP:", tempUser.otp); // Log stored OTP
    console.log("Entered OTP:", otp);

    if (String(tempUser.otp).trim() !== String(otp).trim()) {
        return res.send("Invalid OTP");
    }


    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(tempUser.password, salt);
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newAccount = new Account({
        username: tempUser.username,
        name: tempUser.name,
        password: hash,
        accountNumber,
        email: tempUser.email
    });

    await newAccount.save();
    delete tempUsers[username];

    const token = jwt.sign({ username: username}, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.cookie("tokentwo", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        expires: new Date((Date.now() + 3600000) * 24)
    });

    res.send("Account created successfully.");
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
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict",
                expires: new Date((Date.now() + 3600000) * 24)
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

exports.getAll = async (req, res) => {
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

exports.userInfo = async (req, res) => {
    const token = req.cookies.tokentwo;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const foundUser = await Account.findOne({ username });
    const name = foundUser.name;
    const balance = foundUser.balance;
    const accountNumber = foundUser.accountNumber;
    const email = foundUser.email
    res.json({ name, username, balance, accountNumber, email });
}
