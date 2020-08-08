/*requiring mongodb node modules */
const mongodb = require("mongodb");
const assert = require("assert");

const ObjectID = mongodb.ObjectID;
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

exports.onConnect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      } else {
        assert.equal(null, err);
        resolve([db, ObjectID]);
      }
    });
  });
};
