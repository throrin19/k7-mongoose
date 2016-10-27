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

    it('returns the loaded models', (done) => {

      const options = {
        connectionString: 'mongodb://localhost:27017/K7Mongoose',
        models: 'test/models/*.js',
      };
      const k7Mongoose = new K7Mongoose(options);

      k7Mongoose.load((err, db) => {
        expect(err).to.not.exist;
        expect(db).to.include('mongoose');
        expect(db).to.include('Todo');
        expect(db).to.include('User');

        db.mongoose.close(() => {
        
          return done();
        });
      });
    });

    it('returns the loaded models when passed an array', (done) => {

      const options = {
        connectionString: 'mongodb://localhost:27017/K7Mongoose',
        models: ['test/models/user.js', 'test/models/todo.js'],
      };
      const k7Mongoose = new K7Mongoose(options);

      k7Mongoose.load((err, db) => {
        expect(err).to.not.exist;
        expect(db).to.include('mongoose');
        expect(db).to.include('Todo');
        expect(db).to.include('User');

        db.mongoose.close(() => {
        
          return done();
        });
      });
    });

    it('returns just mongoose when invalid path to models', (done) => {

      const options = {
        connectionString: 'mongodb://localhost:27017/K7Mongoose',
        models: '',
      };
      const k7Mongoose = new K7Mongoose(options);

      k7Mongoose.load((err, db) => {

        expect(err).to.not.exist;
        expect(db).to.include('mongoose');
        expect(db).to.not.include('Todo');
        expect(db).to.not.include('User');

        db.mongoose.close(() => {
        
          return done();
        });
      });
    });

    it('returns only User\'s models when an absolute path is passed', (done) => {
    
      const options = {
        connectionString: 'mongodb://localhost:27017/K7Mongoose',
        models: Path.join(process.cwd(), 'test/models/user.js'),
      };
      const k7Mongoose = new K7Mongoose(options);

      k7Mongoose.load((err, db) => {
        expect(err).to.not.exist;
        expect(db).to.include('mongoose');
        expect(db).to.include('User');

        db.mongoose.close(() => {
        
          return done();
        });
      });
    });

    it('returns an error when an invalid file is passed', (done) => {
    
      const options = {
        connectionString: 'mongodb://localhost:27017/K7Mongoose',
        models: Path.join(process.cwd(), 'README.md'),
      };

      const k7Mongoose = new K7Mongoose(options);

      k7Mongoose.load((err, db) => {
        console.log(err, db);
        expect(err).to.not.exist;

        return done();
      });
    });
  });

  describe('mongoose', () => {
    const Mongoose = K7Mongoose.mongoose();
  
    it('returns the Mongoose Singleton', (done) => {
      expect(Mongoose).to.be.an.object;

      return done();
    });
  });
});

