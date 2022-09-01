//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const RealEstatePosts = require("./RealEstateDb");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");

///multer code for storing and handling upload images
const multer = require("multer");
const path = require("path");
const RealEstateDb = require("./RealEstateDb");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

///multer code Ends

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Database setup //////////
// mongoose.connect(
//   "mongodb://localhost/realEstate",
//   function () {
//     console.log("DB connected...");
//   },
//   function (error) {
//     console.log(error.message);
//   }
// );

// // run();

// async function run() {
//   const realEstatePost = new RealEstateDb({
//     title: "land for sale",
//     location: "Kipe",
//     price: 120000,
//     tel: 60239834,
//     description:
//       "Un terrain bien place a vendre dans le quartier Kipe, tous les docs sont present",
//   });
//   await realEstatePost.save();
//   console.log(realEstatePost);
// }

//Database setup ends here //////////

//text starting content on pages
const homeStartingContent =
  "We built this website from our heart and soul, we wanted to make something that millions could use and benefit from. With many happy customers and small business selling more than ever and gaining new customers everyday. We will continue to provide more value and improve daily. That is our commitment to you!";
const aboutContent =
  "It all started with a simple idea, which was to connect buyer and seller for a smooth transaction, now we have made an amazing products that are serving millions and growing. The team have grown from 2 to 9 in a short span. We love what we are building here and we are going to do have some product at the end.";
const contactContent =
  "At Katenga our customers are our life blood and we would be delighted to hear from you, even if it's to just say hello! ";
// Image to be stored in upload folder and naming strategies

// mongoose.connect("mongoose://localhost:27017/postDB");

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

//get and post route for our contact form
app.get("/contact", function (req, res) {
  res.render("contact", { startingContactContent: contactContent });
});
app.post("/contact", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  console.log(message);
});

//use emailJS to receive emails. // api integration

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

    // working mongoDB  setup start here
    async function main() {
      const url =
        "mongodb+srv://katenga:Univa2011@cluster0.mxnblja.mongodb.net/?retryWrites=true&w=majority";

      const client = new MongoClient(url);

      try {
        await client.connect();

        await createListing(client, {
          post,
        });
      } catch (e) {
        console.error(e);
      } finally {
        await client.close();
      }
    }
    main().catch(console.error);

    //creating a electronic post / listing
    async function createListing(client, newListing) {
      const result = await client
        .db("electronicsDB")
        .collection("electronicsPosts")
        .insertOne(newListing);

      console.log(
        `New listing created with the following id: ${result.insertedId}`
      );
    }
    async function listDatabases(client) {
      const databasesList = await client.db().admin().listDatabases();
      console.log("Databases:");
      databasesList.databases.forEach((db) => {
        console.log(`- ${db.name}`);
      });
    }

    // MongoDB connection ends heree
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

  app.post(
    "/electronicsCompose",
    upload.array("images", 5),
    function (req, res) {
      // console.log(req.files[0].originalname);
      // const images = req.files[0].originalname;
      const electronicTitle = req.body.electronicTitle;
      const electronicPrice = req.body.electronicPrice;
      const electronicBrand = req.body.electronicBrand;
      const electronicModel = req.body.electronicModel;
      const electronicColor = req.body.electronicColor;
      const electronicLocation = req.body.electronicLocation;
      const electronicTel = req.body.electronicTel;
      const electronicDate = req.body.electronicDate;
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
        electronicDate: electronicDate,
        electronicDescription: electronicDescription,
        // images: images,
      };

      // //image uploader

      electronicsPosts.unshift(electronicPost);

      res.redirect("/electronicsHome");
    }
  );
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
        // images: electronicPost.images,
      });
    }
  });
});

//server route
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
