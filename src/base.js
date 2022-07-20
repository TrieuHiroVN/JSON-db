const fs = require('fs');
const Path = require('path');

module.exports.readJSON = (path) => {
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

module.exports.writeJSON = (path, data, check) => {
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