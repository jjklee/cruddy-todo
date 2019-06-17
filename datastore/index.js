const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileName =  path.join(exports.dataDir, id + '.txt');
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error creating file');
      } else {
        // console.log("success");
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading file');
    } else {
      // _.map(files, file => {
      //   let filename = path.join(exports.dataDir, file)
      //   fs.readFile(filename, 'utf8', (err, text) => {
      //   if (err) {
      //     callback(new Error(`No item with id: ${id}`));
      //   } else {
      //     console.log('success', text)
      //     return text;
      //   }})
      // })
      callback(null, files);
    }
  })
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  let filename = path.join(exports.dataDir, id + '.txt')
  fs.readFile(filename, 'utf8', (err, text) => {
  if (err) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }})
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
