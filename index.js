const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fileUpload = require("express-fileupload");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const birds = require("./routes/birds");
const ejs = require("ejs");

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger docs options
const options = {
  customCss: ".topbar{ display : none }",
};

// Created an array to act like temporary storage
let courses = [
  {
    id: "11",
    name: "Learn ReactJS",
    price: 299,
  },
  {
    id: "22",
    name: "Learn Flutter",
    price: 399,
  },
  {
    id: "33",
    name: "Learn Pro backend",
    price: 499,
  },
];

app.set("view engine", "ejs");
app.set("views", "./public");
app.use(express.static(__dirname + "/public"));

// Application level middleware
app.use("/api/v1/birds", birds);

// Used for swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);
// Using express.json() middleware to handle json data in request
app.use(express.json());
// Using fileUpload() middleware to handle fileUpload
app.use(fileUpload());

app.get("/", (req, res) => {
  app.locals.title = "My App";

  res.status(200);
  res.render("index", { message: "Welcome to my learning journey" });
});

app.get("/api/v1/sunil", (req, res) => {
  res.render("index", { message: "Hello from sunil Poonia" });
});

// Sending a object as response
app.get("/api/v1/course", (req, res) => {
  res.status(200).send({ id: "55", name: "Pro backend", price: 999 });
});

// Sending array response
app.get("/api/v1/courses", (req, res) => {
  res.status(200).send(courses);
});

// Handling dynamic url
app.get("/api/v1/mycourse/:courseID", (req, res, next) => {
  if (req.params.courseID !== "11") {
    try {
      throw new Error("Broken");
    } catch (err) {
      next(err);
    }
  }
  const course = courses.find((course) => course.id === req.params.courseID);
  res.status(200).send(course);
});

// Hadling a sample query
app.get("/api/v1/coursequery", (req, res) => {
  const location = req.query.location;
  const device = req.query.device;
  res.status(200).send({ location: location, device: device });
});

// Handling post request to add a new course
app.post("/api/v1/addCourse", (req, res) => {
  console.log(req.body);
  // In Actual app there should be some kind of check on data
  courses.push(req.body);
  res.status(201).send(true);
});

// Post route for image upload
app.post("/api/v1/courseUpload", (req, res) => {
  console.log(req.headers);
  const sampleFile = req.files.sampleFile;
  const path = __dirname + "/images/" + Date.now() + ".jpg";
  sampleFile.mv(path, (err) => {
    if (err) return res.status(500).send("Internal server error");

    res.status(201).send(true);
  });
});

// Handling all types of request method on a given route
app.all("/api/v1/allmethodtest", (req, res) => {
  console.log(req.body);
  res.status(200).send("It responds to all type of http requests");
});

// Handles get request on abcd and acd
app.get("/api/v1/ab?cd", (req, res) => {
  res.send(req.path);
});

// Route handlers
app.get(
  "/api/v1/routehandlers",
  (req, res, next) => {
    console.log(req.path);
    next();
  },
  (req, res) => {
    res.send("Sent from next method");
  }
);

// Handling different requests for same route
app
  .route("/api/v1/books")
  .get((req, res) => {
    res.send("You have done a get request");
  })
  .post((req, res) => {
    res.send("You have done a post request");
  })
  .put((req, res) => {
    res.send("You have done a put request");
  });

// Error handling middleware
// Should always have 4 arguments
app.use((err, req, res, next) => {
  // console.error(err);
  console.log("Hello");
  res.status(503).send("something broke");
});
// Making express app to listen on given port
app.listen(PORT, () => {
  console.log("Server is running on port - " + PORT);
});
