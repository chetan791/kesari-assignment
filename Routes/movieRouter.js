const express = require("express");
const movieModel = require("../Model/moviesModel");
const movieRouter = express.Router();

// api to create a new movie 
movieRouter.post("/create", async (req, res) => {
  try {
    const { title } = req.body;
    const movie = new movieModel({ title });
    await movie.save();
    res.status(201).send({ message: "movie created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

movieRouter.get("/LocationBased", async (req, res) => {
  try {
    const { location } = req.query;
    const movies = await movieModel.find({
      locations: {
        $in: [location],
      },
    });
    res.send(movies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

movieRouter.get("/getAllCinemas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cinemas = await movieModel
      .findOne({ _id: id })
      .populate("theaters")
      .exec();

    const theaters = cinemas.theaters.map((data) => {
      data.movies = data.movies.find((e) => e.movie == id);
      return data;
    });
    res.status(200).send({ cinemas: theaters });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = movieRouter;
