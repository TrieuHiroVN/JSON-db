const fs = require('node:fs');
const Path = require('node:path');
const { readJSON, writeJSON } = require('./base');

function pathResolve (path) {
    return Path.resolve(path);
};

class Database {

    /**
     * 
     * @param { string } path Path of the JSON file
     */
    constructor (path) {
        this.dbpath = path;
    };

    /**
     * 
     * @param { string | undefined } key Name of the key
     * @returns Values of the key
     */
    get (key) {
        if (typeof key !== 'string' && typeof key !== 'undefined') throw new TypeError('key must be a string or null');

        const values = readJSON(pathResolve(this.dbpath));

        if (key.includes(".")) return values[key.split(".")[0]][key.split(".")[1]];
        if (key) return values[key];
        return values;
    };

    /**
     * 
     * @param { string } key Name of the key
     * @param { any } value Values of the key
     */
    set (key, value) {
        if (typeof key !== 'string') throw new TypeError('key must be a string');

        const values = readJSON(pathResolve(this.dbpath));

        if (!key.includes(".")) values[key] = value;
        else values[key.split(".")[0]][key.split(".")[1]] = value;

        writeJSON(pathResolve(this.dbpath), values, true);
    };

    /**
     * 
     * @param { string } key Name of the key
     * @param { number } value Number value to add for the key
     */
    add (key, value) {
        if (typeof key !== 'string') throw new TypeError('key must be a string');
        if (typeof value !== 'number') throw new TypeError('value must be a number');

        const values = readJSON(pathResolve(this.dbpath));

        if (!key.includes(".")) {
            if (typeof values[key] !== 'number') throw new Error(`key '${key}' contants a value that is not a number`);
        } else {
            if (typeof values[key.split(".")[0]][key.split(".")[1]] !== 'number') throw new Error(`key '${key}' contants a value that is not a number`);
        };

        values[key] = values[key] + value;

        writeJSON(pathResolve(this.dbpath), values, true);
    };

    /**
     * 
     * @param { string } key Name of the key
     */
    unset (key) {
        if (typeof key !== 'string') throw new TypeError('key must be a string');

        const values = readJSON(pathResolve(this.dbpath));

        if (!key.includes(".")) delete values[key];
        else delete values[key.split(".")[0]][key.split(".")[1]];

        writeJSON(pathResolve(this.dbpath), values, true);
    };

    clear () {
        writeJSON(pathResolve(this.dbpath), {}, true);
    };
};

module.exports = { Database };