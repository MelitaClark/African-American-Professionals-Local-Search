const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const referralsSchema = mongoose.Schema({
  business_type: { type: String, required: true },
  business_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  location: {
    street: String,
    // coord will be an array of string values
    city: [String],
    state: String,
    zipcode: String
  },
  reviews: { type: String, required: true }
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
/*referralsSchema.virtual('location').get(function() {
  return `${this.location.business_name} ${this.location.street}`.trim();
});*/

// this virtual grabs the most recent grade for a restaurant.
/*referralsSchema.virtual("reviews").get(function() {
  const reviewsObj =
    this.reviews.sort((a, b) => {
      return b.date - a.date;
    })[0] || {};
  return reviewsObj.reviews;
});*/

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
referralsSchema.methods.serialize = function() {
  return {
    id: this._id,
    business_type: this.business_type,
    business_name: this.business_name,
    phone_number: this.phone_number,
    reviews: this.reviews,
    location: this.locationString
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Referrals = mongoose.model("Referrals", referralsSchema);

module.exports = { Referrals };
