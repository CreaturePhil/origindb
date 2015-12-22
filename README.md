# OriginDB [![Build Status](https://travis-ci.org/CreaturePhil/OriginDB.svg?branch=master)](https://travis-ci.org/CreaturePhil/OriginDB) [![Dependency Status](https://david-dm.org/creaturephil/OriginDB.svg)](https://david-dm.org/creaturephil/OriginDB) [![devDependency Status](https://david-dm.org/creaturephil/OriginDB/dev-status.svg)](https://david-dm.org/creaturephil/OriginDB#info=devDependencies)

Blazing fast and flexible JSON database.

```js
db(key).set(property, value)
```

Each key in the `db` object **corresponds to a JSON file**.

This can also be view as:

```js
db(file).set(property, value)
```

## Install

```
$ npm install origindb --save
```

## Usage

```js
var db = require('origindb')('db');
db('money').set('phil', 10);
db('money').set('some_user', db('money').get('phil') + 10);
db('seen').set('some_user', Date.now());
db('posts').set('posts', [
  { title: 'OriginDB is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);
```

In the `db` **folder**:

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
    { "title": "OriginDB is awesome!", "body": "...", "likes": 10 },
    { "title": "flexbility ", "body": "...", "likes": 3 },
    { "title": "something someting something", "body": "...", "likes": 8 }
  ]
}
```

## API

### db(databaseDirectory)

Create a new database.

Parameters:

- ``databaseDirectory``: _String_ -
The folder where all the json files will be stored at.

Returns: Function(key)
  - ``key``: _String_ - JSON file in the database directory
  - Returns: _Object_ - Methods of OriginDB.

Examples:

```js
var db = require('origindb')('userdb');
```

```js
var db = require('origindb')('apidb');
```

### get(property, defaultValue)

Get a property and if it does not exist, return the default value instead.

Parameters:

- ``property``: _String_
- ``defaultValue``: _any_

Returns: _any_ - Depends on what is in property.

Example:

```js
// money.json
{
  'phil': 10,
  'stevo': 5
}

// main.js
db('money').get('phil'); // 10
db('money').get('jared', 0); // 0
db('money').get('stevo', 0); // 5
```

### set(property, value)

Set a property with a value. This method automatically saves.

Parameters:

- ``property``: _String_
- ``value``: _any_

Returns: _Object_ - Methods of OriginDB. This is useful for chaining methods
together.

Examples:

```js
// main.js
db('money')
  .set('phil', 10)
  .set('josh', 89)
  .set('mike', db.get('mike', 0))
  .set('alex', 17);

// money.json
{
  'phil': 10,
  'josh': 89,
  'mike': 0,
  'alex': 17
}
```

```js
db('tickets').set('phil', db('tickets').get('phil').concat[generateTicket()]);
```

### object()

Get the JSON object to directly manipulate it.

Parameters: None

Returns: _Object_

Example:

```js
// money.js
{
  "phil": 10,
  "some_user": 20,
  "john": 10,
  "mike": 23,
}

// main.js
var users = db('money').object();
var total = Object.keys(users).reduce(function(acc, cur) {
  return acc + users[cur];
}, 0);

console.log(total); // 63
```

## License

MIT © [Phil](http://creaturephil.github.io)
