const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const port = 5000;

connectToMongo();
const app = express();
app.use(cors());
app.use(express.json());

//available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("hello i am home page");
});

app.listen(port, () => {
  console.log(
    `backend app is litsening with ${port} on http://localhost:${port}`
  );
});
