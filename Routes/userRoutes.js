const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel");
const { auth } = require("../middleware/authMiddleware");
const theaterModel = require("../Model/theaterModel");
const movieModel = require("../Model/moviesModel");

// register endpoint
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const verify = await userModel.findOne({ email });
    console.log(verify);
    if (!verify) {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          const user = new userModel({
            name,
            email,
            password: hash,
            tickets: [],
          });
          await user.save();
          res.status(201).send({ message: "user created successfully" });
        }
      });
    } else {
      res.send({ msg: "user already exist" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// login endpoint
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const token = jwt.sign({ userID: user._id }, "kesari", {
        expiresIn: "30d",
      });
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        }
        if (result) {
          res.status(200).send({ message: "login successfully", token });
        } else {
          res.status(401).send({ message: "invalid credentials" });
        }
      });
    } else {
      res.status(401).send({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// book ticket
userRouter.patch("/booktickets", auth, async (req, res) => {
  try {
    const { theaterID, movieID, userID, seats } = req.body;
    const theater = await theaterModel.findOne({ _id: theaterID });
    const movie = await movieModel.findOne({ _id: movieID });

    const show_time = theater.movies.find((e) => {
      if (e.movie == movieID) {
        return e;
      }
    }).show_time;

    console.log(show_time);

    const booked = await userModel.findByIdAndUpdate(userID, {
      $addToSet: {
        tickets: {
          movie: movie.title,
          theater: theater.name,
          show_time: show_time,
          seats: seats,
        },
      },
    });
    res.status(200).send("Tickets book successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
