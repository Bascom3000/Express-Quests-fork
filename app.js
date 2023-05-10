require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;


const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");
const validators = require("./validators");


app.post("/api/movies", validators.validateMovie, movieHandlers.postMovie);
app.post("/api/users", validators.validateUser, usersHandlers.postUser);
app.put("/api/movies/:id", validators.validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validators.validateUser, usersHandlers.updateUser);


app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users/", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", usersHandlers.updateUser)
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", usersHandlers.deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
