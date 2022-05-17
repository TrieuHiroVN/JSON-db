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
const db = require('json-db');
const path = 'database/data.json'; // require path from start folder. In this case 'example_folder' is the start folder and 'database/data.json' is path

// set a value for a key
db.set(
    path,
    'database', // key name
    'JSON' // value
);
db.set(path, 'user', { name: 'Albert', age: 18 });
db.set(path, 'aNumber', 1);

// edit a key contents a value that is a number
db.add(path, 'aNumber', 3);
db.add(path, 'user.age', 2) // using dot will also work in an object value
db.add(path, 'database', 0); // return an error while key 'database' contants a value that is not a number

// delete a key
db.unset(path, 'database');

// get values of a key or the entire json file
db.get(path); // return { user: { name: 'Albert', age: 20 }, aNumber: 4 }
db.get(path, 'user') // return { name: 'Albert', age: 20 }
db.get(path, 'database') // return undefined

db.clear(); // clear the database
```