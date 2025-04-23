const http = require('http');
const express = require("express");
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017/POS';
const app = express();
const PORT = 8001;
const userRouter = require("./routes/user");
const { connectMongoDB } = require('./connection');
const { logUsers } = require('./middlewares');
const categoryRouter = require('./routes/category');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Connection to mongo
connectMongoDB(url).then(() => {
    console.log("Connected to MongoDB successfully");
});;

// Middleware
app.use(logUsers('./pos.log'));

// Routes
app.use("/api/users", userRouter);

app.use("/api/category", categoryRouter);

app.get("/", (req, res) => {
    return res.json({ 'message': "Welcome to POS" });
});

app.listen(PORT, () => {
    console.log("Server Started at PORT " + PORT);
});