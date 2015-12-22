# OriginDB [![Build Status](https://travis-ci.org/CreaturePhil/OriginDB.svg?branch=master)](https://travis-ci.org/CreaturePhil/OriginDB) [![Dependency Status](https://david-dm.org/creaturephil/OriginDB.svg)](https://david-dm.org/creaturephil/OriginDB) [![devDependency Status](https://david-dm.org/creaturephil/OriginDB/dev-status.svg)](https://david-dm.org/creaturephil/OriginDB#info=devDependencies)

Serverless and flexible JSON database.

Each key in the `db` object corresponds to a JSON file.

## Install

```
$ npm install origindb --save
```

## Usage

```js
var db = require('origindb')('directory_name');
db('money').phil = 10;
db('seen').some_user = Date.now();
db('posts').posts = [
  { title: 'OriginDB is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
];
db.save();
```

In `directory_name` **folder**:

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

## License

MIT © [Phil](http://creaturephil.github.io)
