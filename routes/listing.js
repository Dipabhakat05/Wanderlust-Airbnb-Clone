const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync (listingController.index))

.post( isLoggedIn,upload.single("listing[image][url]"), validateListing, wrapAsync (listingController.createListing)
);


//New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync (listingController.showListing))
.put( isLoggedIn, isOwner, upload.single("listing[image][url]" ), validateListing, wrapAsync (listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

// routes/listing.js or app.js
router.get("/", async (req, res) => {
  const { category } = req.query;

  let allListings;
  if (category) {
    // If a category query exists (e.g. /listings?category=rooms), filter by category
    allListings = await Listing.find({ category });
  } else {
    // Otherwise, fetch all listings
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings });
});


module.exports = router;
