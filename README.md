k7-mongoose
===
k7 adapter for mongoose ODM

[![Build Status](https://travis-ci.org/thebergamo/k7-mongoose.svg)](https://travis-ci.org/thebergamo/k7-mongoose)
[![Dependencies Status](https://david-dm.org/thebergamo/k7-mongoose.svg)](https://david-dm.org/thebergamo/k7-mongoose)
[![DevDependencies Status](https://david-dm.org/thebergamo/k7-mongoose/dev-status.svg)](https://david-dm.org/thebergamo/k7-mongoose#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/npm/k7-mongoose/badge.svg)](https://snyk.io/test/npm/k7-mongoose)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

K7-Mongoose is an Adapter for using Mongoose (MongoDB ODM) in Hapi by K7 connector

## Usage

For example: 

```javascript
const Hapi = require('hapi');
const Server = new Hapi.Server();

Server.connection({host: 'localhost'});

let options = {
    adapter: require('k7-mongoose'),
    connectionString: 'mongodb://localhost:27017/K7Mongoose'
};

Server.register({
    register: require('k7'),
    options: options
}, (err) => {
    if (err) {
        throw err;
    }
    
    Server.start((err) => {
        if (err) {
            throw err;
        }
        
        Server.log('info', 'Server running at: ' + Server.info.uri);
    });
});
```

This example does: 
1. Setting the k7-mongoose adapter
2. Setting the connectionString for mongoose connect
3. Register the k7 to Hapi.js

## Options
All the options available in [Mongoose][mongoose] can be setted in `connectionOptions`. You can see more about that in [tests](test/index.js).

## Models
You can define your models schema like you do, but you need to replace the `const mongoose = require('mongoose');` on top of your models by update with `const mongoose = require('k7').mongoose;`

**Why this is required?** Because mongoose is a singleton, therefore you need to use the **k7-mongoose** instantiated version.

## Examples
You can see **k7** and **k7-mongoose** in action in the repo: [Start-Hapiness][start-hapiness] at the version 2.0. Actually that version is in a branch. 

## Testing
For testing you just need clone this repo and run `npm install && npm test` inside root folder of this project.; 

[start-hapiness]: https://github.com/thebergamo/start-hapiness/blob/dev-2.0
[mongoose]: http://mongoosejs.com/
