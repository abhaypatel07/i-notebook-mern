const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = () => {
  mongoose
    .connect(
      "mongodb+srv://abhaypatel1607:ns4oBBhNPE5pVB2s@cluster0.7yghf1b.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("connection succesful with Mongodb");
    })
    .catch(() => {
      console.log("Mongodb has some error..");
    });
};

module.exports = connectToMongo;

//ns4oBBhNPE5pVB2s
