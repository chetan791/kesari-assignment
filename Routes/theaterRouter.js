const express = require("express");
const theaterModel = require("../Model/theaterModel");
const movieModel = require("../Model/moviesModel");
const theaterRouter = express.Router();

theaterRouter.post("/create", async (req, res) => {
  try {
    const { name, location } = req.body;
    const theater = new theaterModel({ name, location, movies: [] });
    await theater.save();
    res.status(201).send({ message: "theater created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

theaterRouter.patch("/addMovie", async (req, res) => {
  try {
    const { theaterId, movieId, show_time } = req.body;

    const updateTheater = await theaterModel.findByIdAndUpdate(
      theaterId,
      {
        $addToSet: { movies: { movie: movieId, show_time } },
      },
      {
        new: true,
      }
    );

    await movieModel.findByIdAndUpdate(
      movieId,
      {
        $addToSet: { locations: updateTheater.location },
        $addToSet: { theaters: theaterId },
      },
      {
        new: true,
      }
    );

    res.status(200).send("Movie Added to the theater successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = theaterRouter;
