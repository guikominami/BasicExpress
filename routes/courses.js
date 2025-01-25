const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.post("/insert", (req, res) => {
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

router.put("/update/:id", (req, res) => {
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

router.delete("/delete/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    //404 (object not found)
    return res.status(404).send("The course with the given ID was not found.");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //delete
  res.send(course);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found."); //404 (object not found)
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

module.exports = router;
