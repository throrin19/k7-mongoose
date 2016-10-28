k7-mongoose
===
`k7` adapter for mongoose ODM

[![Build Status](https://travis-ci.org/thebergamo/k7-mongoose.svg)](https://travis-ci.org/thebergamo/k7-mongoose)

Lead Maintainer: [Marcos Bérgamo](https://github.com/thebergamo)

## Example Usage

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

This example does the following: 
1. Setting the k7-mongoose adapter
2. Setting the connectionString for mongoose connect
3. Register the k7 to Hapi.js

## Options
All the options available in [Mongoose][mongoose] can be setted in `connectionOptions`.

## Set up the models
You can define your models schema like you're already do, but you need to replace the `const mongoose = require('mongoose');` on top of your models by update with `const mongoose = require('k7-mongoose').mongoose();`

**Why this is required?** Because mongoose is a singleton, therefore you need to use the **k7-mongoose** instantiated version.

[mongoose]: http://mongoosejs.com/
