/*requiring mongodb node modules */
const mongodb = require("mongodb");
const assert = require("assert");
const config = require("../config/config");
var url = config.dbUri;

const ObjectID = mongodb.ObjectID;
var MongoClient = require("mongodb").MongoClient;

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
