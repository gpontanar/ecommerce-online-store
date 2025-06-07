const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//[SECTION] Routes
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

// [SECTION] Environment Setup
require('dotenv').config(); 

const app = express();

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);

// If the connection is successful, output in the console
mongoose.connection.once("open", () => console.log("We're connected to the cloud database"));

// Setup for allowing the server to handle data from requests
// Allows your app to read json data
app.use(express.json());
// Allows your app to read data from forms
app.use(express.urlencoded({extended:true}));

// Port:
// const port = 3000;
const port = 4000;

		// const corsOptions = {
		// 	// Allow request from this origin (the client's URL) the origin is in array form if there are multiple origins

		// 	// origin: ['http://localhost:8000','http://zuitt-bootcamp-prod-521-8525-pontanar.s3-website.us-east-1.amazonaws.com'],
		// 	origin: ['http://localhost:8000','https://your-frontend.vercel.app'],
		// 	// origin: ['http://localhost:3000'],
		// 	// Allow only specified HTTP methods, optional only if you want to restrict the methods
		// 	// methods: ['GET', 'POST'],
		// 	credentials: true,
		// 	optionsSuccessStatus: 200
		// }

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cors(corsOptions));

//[SECTION] Backend Routes 
// app.use("/b5/users", userRoutes);
// app.use("/b5/products", productRoutes);
// app.use("/b5/orders", orderRoutes);
// app.use("/b5/cart", cartRoutes);

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);

if(require.main === module){
	app.listen(process.env.PORT || port, () => console.log(`Server running at port ${process.env.PORT || port}`));
}

module.exports = {app,mongoose};