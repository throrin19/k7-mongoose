'use strict';

// Load modules

const Async = require('async');
const Hoek = require('hoek');
const Glob = require('glob');
const Mongoose = require('mongoose');
const VError = require('verror');

const internals = {
    defaults: {
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
    }
};

internals.utility = {
    getFiles(models, done) {

        const iteratee = function (memo, item, callback) {

            const globOptions = {
                realpath: true
            };

            Glob(item, globOptions, (err, model) => {

                if (err) {
                    return callback(err);
                }

                process.nextTick(() => callback(null, memo.concat(model)));
            });
        };

        return Async.reduce(models, [], iteratee, done);
    },

    loadModels(files, done) {

        const iteratee = function (memo, item, callback) {

            let model;

            try {
                model = require(item);
                memo[model.modelName] = model;

                return process.nextTick(() => callback(null, memo));
            }
            catch (err) {

                const error = new VError(err, `${item} is not a valid model`);

                return process.nextTick(() => callback(error));
            }
        };

        return Async.reduce(files, {}, iteratee, done);
    }
};

class K7Mongoose {
    constructor(options) {

        this._settings = Hoek.applyToDefaults(internals.defaults, options);
        this.db = {};

        const models = this._settings.models;

        this._settings.models = Array.isArray(models) ? models : [models];
    }

    load(done) {

        const tasks = [
            Async.apply(internals.utility.getFiles, this._settings.models),
            internals.utility.loadModels
        ];

        Mongoose.connect(this._settings.connectionString, this._settings.connectionOptions);

        Async.waterfall(tasks, (err, models) => {

            if (err) {
                return done(err);
            }

            this.db = models;

            this.db.mongoose = Mongoose.connection;

            this.db.mongoose.on('connected', this._settings.events.connected);
            this.db.mongoose.on('disconnected', this._settings.events.disconnected);
            this.db.mongoose.on('error', this._settings.events.error);

            return done(null, this.db);
        });
    }

    static mongoose() {

        return Mongoose;
    }
}

module.exports = K7Mongoose;
