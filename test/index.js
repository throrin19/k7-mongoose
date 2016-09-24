'use strict';

// Load modules

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Path = require('path');

// Load example

const K7Mongoose = require('../lib');

// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;
const describe = lab.describe;
const after = lab.after;
const before = lab.before;

describe('K7Mongoose', () => {

  describe('load', () => {
    const options = {
      connectionString: 'mongodb://localhost:27017/K7Mongoose',
      models: 'test/models/*.js',
    };
    const k7Mongoose = new K7Mongoose(options);

    it('returns the loaded models', (done) => {
      k7Mongoose.load((err, db) => {
        expect(err).to.not.exist;
        expect(db).to.include('mongoose');
        expect(db).to.include('Todo');
        expect(db).to.include('User');

        db.mongoose.close(() => {
        
          done();
        });
      });
    });
  });

  describe('mongoose', () => {
  
  });
});

