const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Oluwasegun:nvidia@cluster0.jgruyhl.mongodb.net/?retryWrites=true&w=majority";


// Express APIs
const api = require("./Routes/auth.routes");
// Connecting MongoDB
/*
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("test").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}run().catch(console.dir);
*/
async function mongoDbConnection() {
  await mongoose.connect(
    "mongodb+srv://Oluwasegun:nvidia@cluster0.jgruyhl.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    6000
  );
}
mongoDbConnection().then(() => {
  console.log("MongoDB successfully connected.");
}),(err) => {
    console.log("Could not connected to database : " + err);
  };
// Express settings
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
// Serve static resources
app.use("/public", express.static("public"));
app.use("/api", api);
// Define PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});
// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});