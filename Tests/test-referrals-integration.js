'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { Referrals} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedReferralsData() {
  console.info('seeding referrals data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateReferralsData());
  }
  // this will return a promise
  return Referrals.insertMany(seedData);
}

// used to generate data to put in db
function generatebusiness_type() {
  const businesses = [
    'Dentist', 'Doctor', 'Web Developer', 'Handyman', 'Photographer'];
  return businesses[Math.floor(Math.random() * businesses.length)];
}

// used to generate data to put in db
function generateBusiness_name() {
  const nameOfBus = ['Jennys Dental', 'Doctor Don', 'Handy-Manny', 'Click-take-a-Pic'];
  return nameOfBus[Math.floor(Math.random() * nameOfBus.length)];
}

// used to generate data to put in db
function generatePhone() {
  const phone = ['973-222-2222', '974-222-2223', '975-222-2224', '976-222-2225'];
  const phone = phone[Math.floor(Math.random() * phone.length)];
  return phone[Math.floor(Math.random() * phone.length)];
    
  }


// generate an object represnting a referral.
// can be used to generate seed data for db
// or request.body data
function generateReferralsData() {
  return {
    business_type: generatebusiness_type(),
    business_name: generateBusiness_name(),
    phone_number: generatePhone(),
    location: {
      street: faker.location.streetAddress(),
      city: faker.location.cityName(),
      zipcode: faker.location.zipCode()
    }

  };
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Referrals API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRestaurantData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedReferralsData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function() {

    it('should return all existing referrals', function() {
      // strategy:
      //    1. get back all restaurants returned by by GET request to `/restaurants`
      //    2. prove res has right status, data type
      //    3. prove the number of restaurants we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/referrals')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body.referrals).to.have.lengthOf.at.least(1);
          return Referrals.count();
        })
        .then(function(count) {
          expect(res.body.restaurants).to.have.lengthOf(count);
        });
    });


    it('should return referrals with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resReferrals;
      return chai.request(app)
        .get('/referrals')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.referrals).to.be.a('array');
          expect(res.body.referrals).to.have.lengthOf.at.least(1);

          res.body.referrals.forEach(function(referrals) {
            expect(referrals).to.be.a('object');
            expect(referrals).to.include.keys(
              'id', 'business_type', 'business_name', 'phone_number', 'location');
          });
          resReferrals = res.body.referrals[0];
          return Referrals.findById(resReferrals.id);
        })
        .then(function(referrals) {

          expect(resReferrals.id).to.equal(referrals.id);
          expect(resReferrals.business_type).to.equal(referrals.business_type);
          expect(resReferrals.business_name).to.equal(referrals.business_name);
          expect(resReferrals.phone_number).to.equal(referrals.phone_number);
          expect(resReferrals.location).to.contain(referrals.location.city);
          
        });
    });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new referral', function() {

      const newReferral = generateReferralsData();

      return chai.request(app)
        .post('/referrals')
        .send(newReferral)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'business_type', 'business_name', 'phone_number', 'location');
          expect(res.body.business_type).to.equal(newReferral.business_type);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.business_name).to.equal(newReferral.business_name);
          expect(res.body.phone_number).to.equal(newReferral.phone_number);
          expect(res.body.location).to.equal(newReferral.location);
        })
        .then(function(restaurant) {
          expect(restaurant.business_type).to.equal(newReferral.business_type);
          expect(restaurant.business_name).to.equal(newReferral.business_name);
          expect(restaurant.phone_number).to.equal(newReferral.phone_number);
          expect(restaurant.location.street).to.equal(newReferral.location.street);
          expect(restaurant.location.city).to.equal(newReferral.location.city);
          expect(restaurant.location.zipcode).to.equal(newReferral.location.zipcode);
        });
    });
  });

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        business_type: 'fofofofofofofof',
        business_name: 'futuristic fusion'
      };

      return Referrals
        .findOne()
        .then(function(referrals) {
          updateData.id = referrals.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/referrals/${referrals.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Referrals.findById(updateData.id);
        })
        .then(function(referals) {
          expect(referals.business_type).to.equal(updateData.business_type);
          expect(referals.business_name).to.equal(updateData.business_name);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a referrals
    //  2. make a DELETE request for that referral's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a restaurant by id', function() {

      let referral;

      return Referrals
        .findOne()
        .then(function(_referral) {
          referral = _restaurant;
          return chai.request(app).delete(`/referrals/${referral.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Referrals.findById(referral.id);
        })
        .then(function(_referral) {
          expect(_referral).to.be.null;
        });
    });
  });
});
