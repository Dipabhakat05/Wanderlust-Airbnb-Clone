const Listing = require("../models/listing.js");
const opencage = require("opencage-api-client");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: { path: "author" },
    })
    .populate("owner");
    if(!listing){
         req.flash("error", "Listing  you requested for does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});

};

module.exports.createListing = async (req,res, next) => {

    const address = req.body.listing.location;
  
  const data = await opencage.geocode({
    q: address,
    key: process.env.OPENCAGE_API_KEY
  });
 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = {url, filename};
    }

     if (data?.results?.length > 0) {
    const place = data.results[0];
    newListing.geometry = {
      type: "Point",
      coordinates: [place.geometry.lng, place.geometry.lat] // GeoJSON format
    };
  } else {
    // Default fallback coordinates if location not found (e.g., Delhi)
    newListing.geometry = {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    };
  }

  // 3. Save to database
  await newListing.save();
  req.flash("success", "New Listing Created!");
   return res.redirect(`/listings/${newListing._id}`);

};

module.exports.renderEditForm = async (req,res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing  you requested for does not exist!");
         return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{ listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    // 1. Update text fields and store the listing instance
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save(); 
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};