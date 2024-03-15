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

const formatDate = (input) => {
  const date = new Date(input);
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

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

app.get("/api/users/:id/logs?", (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;
  const user = users.find((user) => user._id === id);
  let userExercises = exercises.filter((exercise) => exercise._id === user._id);
  if (from)
    userExercises = userExercises.filter(
      ({ date }) => formatDate(date) >= from
    );
  if (to)
    userExercises = userExercises.filter(({ date }) => formatDate(date) <= to);
  if (limit) userExercises = userExercises.slice(0, limit);
  userExercises = userExercises.map((userExercise) => {
    const { description, duration, date } = userExercise;
    return {
      description,
      duration,
      date,
    };
  });
  const log = { ...user, count: userExercises.length, log: userExercises };
  res.json(log);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
