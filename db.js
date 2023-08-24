const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/inotebook")
    .then(() => {
      console.log("connection succesful with Mongodb");
    })
    .catch(() => {
      console.log("Mongodb has some error..");
    });
};

module.exports = connectToMongo;
