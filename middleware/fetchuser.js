const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = "ABHAYPATELISAGOODANDHONESTBOY";

const fetchuser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }

  try{
      const data = jwt.verify(token, JWT_SECRETKEY);
      console.log(data);
      req.user = data.user;
      next();
  }catch{
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchuser;
