const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

//get the values of environment variables
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get("env")}`);
// console.log(`NODE_ENV: ${process.env.app_password}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //to access files in static folder

//when in production, change the environment variable to NODE_ENV=production
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);

app.use(function (req, res, next) {
  console.log("Authenticating...");
  next();
});

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
  res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses/insert", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error)
    //400: bad request
    return res.status(400).send(error.details[0].message);

  const newCourse = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(newCourse);
  res.send(newCourse);
});

app.put("/api/courses/update/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send("The course with the given ID was not found."); //404 (object not found)

  const { error } = validateCourse(req.body);

  if (error)
    //400: bad request
    return res.status(400).send(error.details[0].message);

  //update
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/delete/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    //404 (object not found)
    return res.status(404).send("The course with the given ID was not found.");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //delete
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found."); //404 (object not found)
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
