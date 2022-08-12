//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");

///multer code
const multer = require("multer");
const path = require("path");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

// app.post("/electronicsCompose", upload.single("image"), function (req, res) {
//   console.log(req.file);
//   res.send("single files upload successful");
// });
app.post("/electronicsCompose", upload.array("images", 2), function (req, res) {
  console.log(req.files);
  res.send("multiple files uploaded successfully");
});
///multer code Ends

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//text starting content on pages
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. ";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Image to be stored in upload folder and naming strategies

// mongoose.connect("mongoose://localhost:27017/postDB");

//mongoose setup

// const postsSchema = {
//   title: String,
// };
// const Post = mongoose.model("Post", postsSchema);

///global variables
const posts = [];
const carsPosts = [];
const electronicsPosts = [];

app.get("/", function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
    carsPosts: carsPosts,
    electronicsPosts: electronicsPosts,
  });
});
const monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const day = new Date().getDate();
const month = new Date();
let dayYear = monthName[month.getMonth()] + " " + day;
console.log(dayYear);

app.get("/about", function (req, res) {
  res.render("about", { aboutStartingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { startingContactContent: contactContent });
});

//get and post route for real estate listings

app.get("/realEstateHome", function (req, res) {
  res.render("realEstateHome", {
    posts: posts,
  });

  app.get("/compose", function (req, res) {
    res.render("compose");
  });
  //post route
  app.post("/compose", function (req, res) {
    //date next to post title

    const title = req.body.title;
    const price = req.body.price;
    const tel = req.body.tel;
    const location = req.body.location;
    const description = req.body.description;
    const listingDate = dayYear;

    const post = {
      title: req.body.title,
      price: req.body.price,
      tel: req.body.tel,
      location: req.body.location,
      description: req.body.description,
    };

    posts.unshift(post);

    res.redirect("/realEstateHome");
  });
});

//dynamic route
app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        price: post.price,
        tel: post.tel,
        location: post.location,
        description: post.description,
      });
    }
  });
});

//cars compose form and get route
app.get("/carsTrucksHome", function (req, res) {
  res.render("carsTrucksHome", {
    startingContent: homeStartingContent,
    carsPosts: carsPosts,
  });
});
app.get("/carsCompose", function (req, res) {
  res.render("carsCompose");

  app.post("/carsCompose", function (req, res) {
    const carTitle = req.body.carTitle;
    const carPrice = req.body.carPrice;
    const carTel = req.body.carTel;
    const carBrand = req.body.carBrand;
    const carModel = req.body.carModel;
    const carMileage = req.body.carMileage;
    const carYear = req.body.carYear;
    const carColor = req.body.carColor;
    const carLocation = req.body.carLocation;
    const carImage1 = req.body.carImage1;
    const carDescription = req.body.carDescription;

    console.log(carTitle);

    //car post object
    const carPost = {
      carTitle: carTitle,
      carPrice: carPrice,
      carBrand: carBrand,
      carModel: carModel,
      carMileage: carMileage,
      carYear: carYear,
      carColor: carColor,
      carLocation: carLocation,
      carTel: carTel,
      carImage1: carImage1,
      carDescription: carDescription,
    };
    carsPosts.unshift(carPost);

    // console.log(carsPosts);

    res.redirect("/carsTrucksHome");
  });
});

// dynamic route for car listing
app.get("/carsPosts/:carPostName", function (req, res) {
  const requestedCarTitle = _.lowerCase(req.params.carPostName);

  carsPosts.forEach(function (carPost) {
    const storedCarTitle = _.lowerCase(carPost.carTitle);

    if (storedCarTitle === requestedCarTitle) {
      res.render("carsPosts", {
        carTitle: carPost.carTitle,
        carPrice: carPost.carPrice,
        carTel: carPost.carTel,
        carBrand: carPost.carBrand,
        carModel: carPost.carModel,
        carMileage: carPost.carMileage,
        carYear: carPost.carYear,
        carColor: carPost.carColor,
        carLocation: carPost.carLocation,
        carDescription: carPost.carDescription,
      });
    }
  });
});

//get route for electronics

app.get("/electronicsHome", function (req, res) {
  res.render("electronicsHome", {
    electronicsPosts: electronicsPosts,
    startingContent: homeStartingContent,
  });
});

app.get("/electronicsCompose", function (req, res) {
  res.render("electronicsCompose");

  app.post("/electronicsCompose", function (req, res) {
    const electronicTitle = req.body.electronicTitle;
    const electronicPrice = req.body.electronicPrice;
    const electronicBrand = req.body.electronicBrand;
    const electronicModel = req.body.electronicModel;
    const electronicColor = req.body.electronicColor;
    const electronicLocation = req.body.electronicLocation;
    const electronicTel = req.body.electronicTel;
    const electronicDescription = req.body.electronicDescription;

    //console.log(electronicTitle);

    //car post object
    const electronicPost = {
      electronicTitle: electronicTitle,
      electronicPrice: electronicPrice,
      electronicBrand: electronicBrand,
      electronicModel: electronicModel,
      electronicColor: electronicColor,
      electronicLocation: electronicLocation,
      electronicTel: electronicTel,
      electronicDescription: electronicDescription,
    };

    // //image uploader

    electronicsPosts.unshift(electronicPost);

    res.redirect("/electronicsHome");
  });
});

//Create dynamic route for electronics pages

app.get("/electronicsPosts/:electronicPostName", function (req, res) {
  const requestedElectronicTitle = _.lowerCase(req.params.electronicPostName);

  electronicsPosts.forEach(function (electronicPost) {
    const storedElectronicTitle = _.lowerCase(electronicPost.electronicTitle);

    if (storedElectronicTitle === requestedElectronicTitle) {
      res.render("electronicsPosts", {
        electronicTitle: electronicPost.electronicTitle,
        electronicPrice: electronicPost.electronicPrice,
        electronicBrand: electronicPost.electronicBrand,
        electronicModel: electronicPost.electronicModel,
        electronicColor: electronicPost.electronicColor,
        electronicLocation: electronicPost.electronicLocation,
        electronicTel: electronicPost.electronicTel,
        electronicDescription: electronicPost.electronicDescription,
      });
    }
  });
});

//server route
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
