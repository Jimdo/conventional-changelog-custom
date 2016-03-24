'use strict';

const findup = require('findup');
const fs = require('fs');
const path = require('path');

const CHANGELOGRC = '.changelogrc';

module.exports = function getConfigFromRcFile() {
  return new Promise((resolve, reject) => {
    findup(process.cwd(), CHANGELOGRC, (err, filePath) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(filePath);

      fs.readFile(path.join(filePath, CHANGELOGRC), (readError, content) => {
        if (readError) {
          reject(readError);
          return;
        }

        resolve(JSON.parse(content.toString()));
      });
    });
  });
};
