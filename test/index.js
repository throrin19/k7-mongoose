'use strict';

// Load modules

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Path = require('path');
const Sinon = require('sinon');

// Load example

const K7 = require('k7');
const K7Mongoose = require('../lib');

// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;
const describe = lab.describe;
const after = lab.after;
const before = lab.before;

describe('K7Mongoose', () => {
  let options = {
    connectionString: 'mongodb://localhost:27017/K7Mongoose',
    models: 'test/models/*.js',
    adapter: K7Mongoose
  };

  describe('when a plugin is registrated', () => {
    let server = new Hapi.Server();
    let error;
    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('mongoose');
      expect(server.database).to.deep.include('User');
      expect(server.database).to.deep.include('Todo');
      done();
    }); 

    after((done) => {
      server.database.mongoose.close(() => {
        done();
      });
    });
  });

  describe('when a plugin is registrated with an array of models in options', () => {
    let server = new Hapi.Server();
    let error;
    options.models = ['test/models/user.js', 'test/models/todo.js'];
    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('mongoose');
      expect(server.database).to.deep.include('User');
      expect(server.database).to.deep.include('Todo');
      done();
    }); 

    after((done) => {
      server.database.mongoose.close(() => {
        done();
      });
    });
  });

  describe('when a plugin is registrated with adapter as string', () => {
    let server = new Hapi.Server();
    let error;

    options.adapter = Path.join(process.cwd(), './lib');

    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should server have database populated', (done) => {
      // No error

      expect(error).to.not.exist;

      // Instance of K7 should be registered

      expect(server).to.deep.include('database');
      expect(server.database).to.be.an.object();
      expect(server.database).to.deep.include('mongoose');
      expect(server.database).to.deep.include('User');
      expect(server.database).to.deep.include('Todo');
      done();
    }); 

    after((done) => {
      server.database.mongoose.close(() => {
        done();
      });
    });
  });

  describe('when a plugin is registrated and query the model', () => {
    let server = new Hapi.Server();
    let error;
    
    before((done) => {
      const register = {
        register: require('k7'),
        options: options
      };

      server.register([register], (err) => {
        error = err;
        done();
      });
    });

    it('should have an empty array quering user', (done) => {
      server.database.User.find({}, function (err, rows) {
        if (err) {
          throw err;
        }

        expect(rows).to.be.an.array();
        expect(rows).to.be.empty();

        done();
      });
    });
    
  });

  // describe('when a plugin is registrated with a event on connected', () => {
  //   let server = new Hapi.Server();
  //   let error;
  //   let connected = Sinon.spy();
  //
  //   options.events = {
  //     connected: connected 
  //   };
  //
  //   before((done) => {
  //     const register = {
  //       register: require('k7'),
  //       options: options
  //     };
  //
  //     server.register([register], (err) => {
  //       error = err;
  //       done();
  //     });
  //   });
  //
  //   it('should server have database populated', function (done) {
  //     // No error
  //
  //     expect(error).to.not.exist;
  //
  //     // Instance of K7 should be registered
  //     setTimeout(function () {
  //       expect(connected.called).to.be.equal(true);
  //       done(); 
  //     }, 1000);
  //   }); 
  //
  //   after((done) => {
  //     server.database.mongoose.close(() => {
  //       done();
  //     });
  //   });
  // });
  //
  // describe('when a plugin is registrated with a event on disconnected', () => {
  //   let server = new Hapi.Server();
  //   let error;
  //   let disconnect;
  //
  //   options.events = {
  //     disconnected: function () {
  //       disconnect = 'closed!';         
  //     }
  //   };
  //
  //   before((done) => {
  //     const register = {
  //       register: require('k7'),
  //       options: options
  //     };
  //
  //     server.register([register], (err) => {
  //       error = err;
  //       done();
  //     });
  //   });
  //
  //   before((done) => {
  //     server.database.mongoose.close(() => {
  //       done();
  //     });
  //   });
  //
  //   it('should server have database populated', (done) => {
  //     // No error
  //
  //     expect(error).to.not.exist;
  //
  //     // Instance of K7 should be registered
  //
  //     expect(disconnect).to.be.equal('closed!');
  //     done();
  //   }); 
  // });
});

