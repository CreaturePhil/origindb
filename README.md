# eosdb [![Build Status](https://travis-ci.org/CreaturePhil/eosdb.svg?branch=master)](https://travis-ci.org/CreaturePhil/eosdb) [![Dependency Status](https://david-dm.org/creaturephil/eosdb.svg)](https://david-dm.org/creaturephil/eosdb) [![devDependency Status](https://david-dm.org/creaturephil/eosdb/dev-status.svg)](https://david-dm.org/creaturephil/eosdb#info=devDependencies)

Serverless and flexible JSON database.

Each key in the `db` object corresponds to a JSON file.

## Install

```
$ npm install eosdb --save
```

## Usage

```js
var db = require('eosdb')('directory_name');
db('money').phil = 10;
db('seen').some_user = Date.now();
db('posts').posts = [
  { title: 'eosdb is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
];
db.save();
```

In `directory_name` folder:

```json
// money.json
{
  "phil": 10
}

// seen.json
{
  "some_user": 1439674925906
}

// posts.json
{
  "posts": [
    { "title": "eosdb is awesome!", "body": "...", "likes": 10 },
    { "title": "flexbility ", "body": "...", "likes": 3 },
    { "title": "something someting something", "body": "...", "likes": 8 }
  ]
}
```

### Size

```js
for (var i = 0; i < 10; i++) {
  db('num')[i] = i; 
}
console.log(db.size('num')); // outputs 10
```

### Helper `get` methods

Helper `get` methods are just `get` methods that contains a default value
if it is not the specify type.

Why? This is so you don't have to type this everywhere in your code:

```js
var some_amount = 10;
var val = db('money')['some_user'];
db('money')['some_user'] = (val || 0) + some_amount;
```

It is much easier and faster to do this:

```js
var some_amount = 10;
db('money')['some_user'] = db.nget('money', 'some_user') + some_amount;
```

#### aget(file, key)

Get an array value, defaults to `[]`.

Parameters:

`file`: String
`key`: String

Returns: Array

#### nget(file, key)

Get a number value, defaults to `0`.

Parameters:

`file`: String
`key`: String

Returns: Number

#### sget(file, key)

Get a string value, defaults to `""`.

Parameters:

`file`: String
`key`: String

Returns: String

## License

MIT © [Phil](http://creaturephil.github.io)
