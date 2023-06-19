require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;


const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};



const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");
const validators = require("./validators");



/* const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
}; */

const { hashPassword, verifyPassword, verifyToken } = require("./auth");

/* public routes */

app.get("/", welcome);
app.post(
  "/api/login", 
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/users/", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/users",  validators.validateUser, hashPassword, usersHandlers.postUser);

/* private routes */

app.use(verifyToken);  // authentication wall : verifyToken is activated for each route after this line

app.post("/api/movies", validators.validateMovie, movieHandlers.postMovie);
app.put("/api/users/:id", hashPassword, usersHandlers.updateUser);
app.put("/api/movies/:id", validators.validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validators.validateUser, usersHandlers.updateUser);




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
