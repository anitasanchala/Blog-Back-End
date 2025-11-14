const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: db } = require('../models/db');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const loginUser = `SELECT id, password, username FROM users WHERE username = ?`;
        const [loginUserData] = await db.promise().query(loginUser, [username]);
        
        if (loginUserData.length === 0) {
            return res.status(200).json({ status:403,mes: "User Not Found" });
        }
        
        const user = loginUserData[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(200).json({ status:404,mes: "Incorrect Password" });
        }

        const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
        console.log("token",token);
        
        return res.json({ status:200,user: { id: user.id, username: user.username,password: user.password}, token,mes:"User login Successfully" });
    } catch (error) {
        console.log("error in login",error);
        // throw new Error("Error while login");
        return res.status(600).json({ status:600,mes: error.message });

    }
}

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const checkExistingUser = `SELECT id, username, password FROM users WHERE username = ?`;
        const [checkExistingUserData] = await db.promise().query(checkExistingUser,[username]);
        if (checkExistingUserData?.length > 0) {
            return res.status(200).json({ status:405,mes: "User Already Exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUser = `INSERT INTO users(password, username) VALUES (?,?)`;
        const [insertUserData] = await db.promise().query(insertUser, [hashedPassword, username]);
        
        if (insertUserData.affectedRows === 0) {
            return res.status(403).json({ status:403,mes: "User Not Inserted" });
        }
        return res.status(200).json({ status:200,mes: "User Registered" });
    } catch (error) {
        // throw new Error("Error while login");
        return res.status(600).json({ status:600,mes: error.message });
    }
}

module.exports = { login, register }