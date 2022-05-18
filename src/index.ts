import * as fs from 'node:fs';
import * as Path from 'node:path';

type Value = Data | boolean | number | string | null;

interface DataObj {
    [key: keyPart]: Value;
};

type Data = DataObj | Value[];

type keyPart = number | string;

function readJSON (path: string): DataObj {
    let data = null;

    try {
        data = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        throw new Error(`the database ${path} is not exist`);
    };

    try {
        data = JSON.parse(data) as DataObj;
    } catch (e) {
        throw new Error(`Error parsing JSON in '${path}'`);
    };

    return data;
};

function writeJSON (path: string, data: Data, check: boolean): void {
    let strData: string | null = null;

    try {
        strData = JSON.stringify(data, null, '\t');
    } catch (e) {
        throw new Error('structures cannot be stored');
    };

    fs.writeFileSync(path, strData);

    if (check && fs.readFileSync(path, 'utf-8') !== strData) {
        const path2 = `backup-${Date.now()}.json`;

        writeJSON(path2, data, false);
        throw new Error(`error writing JSON in '${path}', backup saved in '${path2}'`)
    };
};

function read (path: string): DataObj {
    return readJSON(Path.resolve(path));
};

export function get (path: string, key: string): any {
    const values = read(path);

    return values[key];
};

export function set (path: string, key: string, newValues: any): void {
    const values = read(path);
    values[key] = newValues;
    writeJSON(Path.resolve(path), values, true);
};

export function add (path: string, key: string, value: number): void {
    const values = read(path);
    if (typeof values[key] !== 'number') throw new Error(`key '${key}' is not a number`);
    if (typeof value !== 'number') throw new Error(`value must be a number`);
    values[key] = Number(values[key]) + value;
    writeJSON(Path.resolve(path), values, true);
};

export function remove (path: string, key: string): void {
    const values = read(path);
    delete values[key];
    writeJSON(Path.resolve(path), values, true);
};