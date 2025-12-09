const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const connectdb = require("./config/db");
app.use(cookieParser());
const { authrouter } = require("./routes/authroutes");
const { profilerouter } = require("./routes/profile");

const port = 4441;

const { feedroute } = require("./routes/feed");
const authtokenvalidate = require("./middleware/authtoken");
app.use(express.json());

app.use("/", authrouter);
app.use("/", authtokenvalidate, feedroute);
app.use("/", authtokenvalidate, profilerouter);

connectdb()
  .then(() => {
    console.log("db connection successfull");
    app.listen(port, () => {
      console.log(`server is running on the port : ${port}`);
    });
  })
  .catch(() => {
    console.log("db connection failed");
  });
