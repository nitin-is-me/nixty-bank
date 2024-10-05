## Nixty-bank
Nixty-bank is a mock bank project. Once you sign up, you're provided a 10 digit unique account number. <br>
You can make transactions using receiver's account number or username.<br>
You can visit your transactions, and click on them to view full details about the specific transaction (dynamic routing).

### Steps to use Nixty-bank
<b>Make sure you've Nodejs installed</b> <br><br>
Step 1: Download, pull or clone the code into your pc.<br>
Step 2: Go to client folder, open terminal there, and run:
```
npm install
```
Step 3: Do the same with server folder to install all the required packages. <br>
Step 4: In server folder, create a folder named "env" and create a ".env" file in it, and put your MONGO_URI and JWT_SECRET in it. <br>
Step 5: Now go in client folder, open terminal, and run:
```
npm run dev
```
Step 6: Go in server folder, open terminal, and run:
```
npm run start
```
Step 7: Now visit http://localhost:3000 in your browser, and enjoy using Nixty-bank! <br><br>
## Version History
| Version | Date       | Summary         |
|---------|------------|-----------------|
|1.0      | **03-Oct-2024** | First Update, basic features like username and password authentication, transaction and its history, are implemented |
<br>
<i>Improvements and suggestions are most welcome!</i>
