'use strict';

// Load modules

const Hoek = require('hoek');
const Glob = require('glob');
const Path = require('path');
const Mongoose = require('mongoose');

const cwd = process.cwd();

let internals = {};

internals.defaults = {
  connectionString: 'mongodb://localhost:27017/test',
  connectionOptions: {
    db: null,
    server: null,
    replset: null,
    user: null,
    pass: null,
    auth: null,
    mongos: false 
  },
  events: {
    connected: function () {
      console.log('Database connection is open');
    },
    disconnected: function () {
      console.log('Database connection is lost'); 
    },
    error: function (err) {
      console.error('Database connection has an error: ' + err);
    }
  },
  models: 'models/**.js'
};

module.exports = internals.K7Mongoose = function (options) {
  options = Hoek.applyToDefaults(internals.defaults, options);

  this.settings = options;
  this.db = {};
};

internals.K7Mongoose.prototype.load = function () {
  Mongoose.connect(this.settings.connectionString, this.settings.connectionOptions);

  this.db = this.getModels();

  this.db['mongoose'] = Mongoose.connection;

  this.db['mongoose'].on('connected', this.settings.events.connected); 
  this.db['mongoose'].on('disconnected', this.settings.events.disconnected); 
  this.db['mongoose'].on('error', this.settings.events.error); 

  return this.db;
};

internals.K7Mongoose.prototype.getModels = function () {
  let files = this.settings.models.reduce((arr, model) => {
    return arr.concat(Glob.sync(model, { nodir: true }));
  }, []); 

  return files.reduce((db, model) => {
    let modelPath = Path.isAbsolute(model) ? model : Path.join(cwd, model);

    try {
      let modelName = modelPath.split('/').reverse()[0].split('.')[0];
      model = require(modelPath);
      db[model.modelName] = model;
      return db;
    } catch (err) {
      console.log(err);
      console.warn(modelPath, 'is not a valid model');
    }
  }, {});
};

internals.K7Mongoose.mongoose = Mongoose;

internals.K7Mongoose.attributes = {
    pkg: require('../package.json')
};
