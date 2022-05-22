require("dotenv").config();
console.log(process.env);

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `devcamper API listening in ${process.env.NODE_ENV} mode on ${PORT}`
  );
});
