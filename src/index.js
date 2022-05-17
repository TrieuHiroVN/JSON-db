// "use strict";
// // const fs = require('fs');
// // const Path = require('path');
// exports.__esModule = true;
// exports.remove = exports.add = exports.set = exports.get = void 0;
// var fs = require("node:fs");
// var Path = require("node:path");
// ;
// function readJSON(path) {
//     var data = null;
//     try {
//         data = fs.readFileSync(path, 'utf-8');
//     }
//     catch (e) {
//         throw new Error("the database ".concat(path, " is not exist"));
//     }
//     ;
//     try {
//         data = JSON.parse(data);
//     }
//     catch (e) {
//         throw new Error("Error parsing JSON in '".concat(path, "'"));
//     }
//     ;
//     return data;
// }
// ;
// function writeJSON(path, data, check) {
//     var strData = null;
//     try {
//         strData = JSON.stringify(data, null, '\t');
//     }
//     catch (e) {
//         throw new Error('structures cannot be stored');
//     }
//     ;
//     fs.writeFileSync(path, strData);
//     if (check && fs.readFileSync(path, 'utf-8') !== strData) {
//         var path2 = "backup-".concat(Date.now(), ".json");
//         writeJSON(path2, data, false);
//         throw new Error("error writing JSON in '".concat(path, "', backup saved in '").concat(path2, "'"));
//     }
//     ;
// }
// ;
// function read(path) {
//     return readJSON(Path.resolve(path));
// }
// ;
// function get(path, key) {
//     var values = read(path);
//     return values[key];
// }
// exports.get = get;
// ;
// function set(path, key, newValues) {
//     var values = read(path);
//     values[key] = newValues;
//     writeJSON(Path.resolve(path), values, true);
// }
// exports.set = set;
// ;
// function add(path, key, value) {
//     var values = read(path);
//     if (typeof values[key] !== 'number')
//         throw new Error("key '".concat(key, "' is not a number"));
//     if (typeof value !== 'number')
//         throw new Error("value must be a number");
//     values[key] = Number(values[key]) + value;
//     writeJSON(Path.resolve(path), values, true);
// }
// exports.add = add;
// ;
// function remove(path, key) {
//     var values = read(path);
//     delete values[key];
//     writeJSON(Path.resolve(path), values, true);
// }
// exports.remove = remove;
// ;

const fs = require('node:fs');
const Path = require('node:path');

function readJSON(path) {
    let data;

    try {
        data = fs.readFileSync(Path.resolve(path));
    } catch (e) {
        throw new Error(`the database '${path}' is not exist`);
    };

    try {
        data = JSON.parse(data);
    } catch (e) {
        throw new Error(`cannot parse JSON at path '${path}'`);
    };

    return data;
};

function writeJSON(path, data, check) {
    let strData;

    try {
        strData = JSON.stringify(data, null, '\t');
    } catch (e) {
        throw new Error('structures cannot be stored');
    };

    fs.writeFileSync(path, strData);

    if (check && fs.readFileSync(path, 'utf-8') !== strData) {
        var path2 = `backup-${Date.now()}.json`;
        writeJSON(path2, data, false);
        throw new Error(`error writing JSON in path '${path}', backup saved in '${path2}'`);
    };
};

function pathResolve (path) {
    return Path.resolve(path);
};

module.exports.get = (path, key) => {
    if (typeof path !== 'string') throw new TypeError('path must be a string');
    if (typeof key !== 'string' && typeof key !== 'undefined') throw new TypeError('key must be a string or null');

    const values = readJSON(pathResolve(path));

    if (key.includes(".")) return values[key.split(".")[0]][key.split(".")[1]];
    if (key) return values[key];
    return values;
};

module.exports.set = (path, key, value) => {
    if (typeof path !== 'string') throw new TypeError('path must be a string');
    if (typeof key !== 'string') throw new TypeError('key must be a string');

    const values = readJSON(pathResolve(path));

    if (!key.includes(".")) values[key] = value;
    else values[key.split(".")[0]][key.split(".")[1]] = value;

    writeJSON(pathResolve(path), values, true);
};

module.exports.add = (path, key, value) => {
    if (typeof path !== 'string') throw new TypeError('path must be a string');
    if (typeof key !== 'string') throw new TypeError('key must be a string');
    if (typeof value !== 'number') throw new TypeError('value must be a number');

    const values = readJSON(pathResolve(path));

    if (!key.includes(".")) {
        if (typeof values[key] !== 'number') throw new Error(`key '${key}' contants a value that is not a number`);
    } else {
        if (typeof values[key.split(".")[0]][key.split(".")[1]] !== 'number') throw new Error(`key '${key}' contants a value that is not a number`);
    };

    values[key] = values[key] + value;

    writeJSON(pathResolve(path), values, true);
};

module.exports.unset = (path, key) => {
    if (typeof path !== 'string') throw new TypeError('path must be a string');
    if (typeof key !== 'string') throw new TypeError('key must be a string');

    const values = readJSON(pathResolve(path));

    if (!key.includes(".")) delete values[key];
    else delete values[key.split(".")[0]][key.split(".")[1]];

    writeJSON(pathResolve(path), values, true);
};

module.exports.clear = (path) => {
    if (typeof path !== 'string') throw new TypeError('path must be a string');

    writeJSON(pathResolve(path), {}, true);
};