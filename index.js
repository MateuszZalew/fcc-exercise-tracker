const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const users = [];
const exercises = [];

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const { username } = req.body;
    const newUser = { _id: uuidv4(), username: username };
    res.json(newUser);
    users.push(newUser);
  });

app.post("/api/users/:id/exercises", (req, res) => {
  const { description, duration } = req.body;
  let { date } = req.body;
  const { id } = req.params;
  if (!date) {
    date = new Date().toDateString();
  }
  const user = users.find((user) => user._id === id);
  const newExercise = {
    ...user,
    description,
    duration: parseInt(duration),
    date: new Date(date).toDateString(),
  };
  res.json(newExercise);
  exercises.push(newExercise);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
