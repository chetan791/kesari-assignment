const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    locations: [
      {
        type: String,
      },
    ],
    theaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theater",
      },
    ],
  },
  {
    versionKey: false,
  }
);

const movieModel = mongoose.model("movie", moviesSchema);

module.exports = movieModel;
