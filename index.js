const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./DB/DB");
const userRouter = require("./Routes/userRoutes");
const theaterRouter = require("./Routes/theaterRouter");
const movieRouter = require("./Routes/movieRouter");

app.use(express.json());

app.use(cors());

app.use("/user", userRouter);
app.use("/theater", theaterRouter);
app.use("/movie", movieRouter);

app.listen(5000, async () => {
  try {
    await connectDB;
    console.log("server is running on port 5000");
  } catch (error) {
    console.log("error in connection", error);
  }
});
