const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uploadRoute = require("./src/Routes/uploadRoutes");
const userRoutes = require("./src/Routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api
app.use("/api", uploadRoute);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
