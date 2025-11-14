const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const db = require('./models/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/posts',postRoutes);

app.get('/',(req,res) => {
    res.status(200).json({message:"Back end server is running"});
})
app.listen(process.env.PORT,() => {
    console.log('Server is running on PORT ' + `http://localhost:${process.env.PORT}`);
});