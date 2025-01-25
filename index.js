const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const express = require("express");
const morgan = require("morgan");

const coursesRouter = require("./routes/courses");
const logger = require("./middleware/logger");
const home = require("./routes/home");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //to access files in static folder

//se digitar essas urls, vai para outros módulos
app.use("/api/courses", coursesRouter);
app.use("/", home);

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
