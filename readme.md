## JSON Database

This module simply store your data as a JSON file

## Example

file tree:
```
example_folder
├── index.js
└── database
    └── data.json
```

```js
const { Database } = require('json-db');

const db = new Database('database/data.json');

// set a value for a key
db.set(
    'database', // key name
    'JSON' // value
);
db.set('user', { name: 'Albert', age: 18 });
db.set('aNumber', 1);

// edit a key contents a value that is a number
db.add('aNumber', 3);
db.add('user.age', 2) // using dot will also work in an object value
db.add('database', 0); // return an error while key 'database' contants a value that is not a number

// delete a key
db.unset('database');

// get values of a key or the entire json file
db.get(); // return { user: { name: 'Albert', age: 20 }, aNumber: 4 }
db.get('user') // return { name: 'Albert', age: 20 }
db.get('database') // return undefined

<<<<<<< HEAD
// clear the database
db.clear();
```
=======
db.clear(path); // clear the database
```
>>>>>>> 29aec625ddf4c8fc400c07353e653dc58f81c1f0
