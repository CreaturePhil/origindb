# OriginDB [![Build Status](https://travis-ci.org/CreaturePhil/OriginDB.svg?branch=master)](https://travis-ci.org/CreaturePhil/OriginDB) [![Dependency Status](https://david-dm.org/creaturephil/OriginDB.svg)](https://david-dm.org/creaturephil/OriginDB) [![devDependency Status](https://david-dm.org/creaturephil/OriginDB/dev-status.svg)](https://david-dm.org/creaturephil/OriginDB#info=devDependencies)

Serverless and flexible JSON database.

```js
db(key).set(prop, value)
```

Each key in the `db` object **corresponds to a JSON file**.

This can also be view as:

```js
db(file).set(prop, value)
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

#### Arguments

- databaseDirectory (String) -
The folder where all the json files will be stored at.

## License

MIT © [Phil](http://creaturephil.github.io)
