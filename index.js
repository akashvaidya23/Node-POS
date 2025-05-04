const express = require("express");
const cors = require('cors');
const app = express();
const { connectMongoDB } = require('./connection');
const { logUsers } = require('./middlewares');
const { categoryRouter } = require('./routes/category');
const { userRouter } = require("./routes/user");
const { brandRouter } = require('./routes/brand');
const { productRouter } = require('./routes/product');
const { countryRouter } = require("./routes/country");
const { stateRouter } = require("./routes/state");
const { cityRouter } = require("./routes/city");
var cookieParcer = require('cookie-parser');
const multer = require('multer');
const upload = multer();
const fs = require("fs");
const { supplierRouter } = require("./routes/supplier");
const PORT = process.env.PORT;
require('dotenv').config();

app.use(express.json({
    limit: "20kb"
}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"));
app.use(cookieParcer());

app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Connection to mongo
const db_url = process.env.DB_url;
const DB_name = process.env.DB_name;
connectMongoDB(db_url, DB_name).then(() => {
    console.log("Connected to MongoDB successfully");
});

// Middleware
app.use(logUsers('./pos.log'));

// Routes
app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.use("/api/country", countryRouter);
app.use("/api/state", stateRouter);
app.use("/api/city", cityRouter);
app.use("/api/supplier", supplierRouter);

app.get("/", (req, res) => {
    return res.json({ 'message': "Welcome to POS" });
});

app.listen(PORT, () => {
    console.log("Server Started at PORT " + PORT);
});