# EosDB [![Build Status](https://travis-ci.org/CreaturePhil/eosdb.svg?branch=master)](https://travis-ci.org/CreaturePhil/eosdb)

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
  posts: [
    { title: 'eosdb is awesome!', body: '...', likes: 10 },
    { title: 'flexbility ', body: '...', likes: 3 },
    { title: 'something someting something', body: '...', likes: 8 }
  ]
}
```

## License

MIT © [Phil](http://creaturephil.github.io)
