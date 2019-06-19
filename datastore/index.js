const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
const writeFilePromise = Promise.promisify(fs.writeFile);

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let pathName = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(pathName, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      if (files.length === 0) return callback(null, []);
      let data = [];
      for (let i = 0; i < files.length; i++) {
        let id = files[i].split('.')[0];
        exports.readOne(id, (err, text) => {
          if (err) {
            callback(err);
          } else {
            data.push(text);
            if (data.length === files.length) {
              callback(null, data);
            }
          }
        });
      }
    }
  });
};

exports.readOne = (id, callback) => {
  let pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathName, 'utf8', (err, text) => {
    if (err) {
      callback(err);
    } else {
      // callback(null, { id, text });
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  let pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathName, 'utf8', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathName, text, 'utf8', (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(pathName, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
