'use strict';

const fs = require('fs');
let entries = [];
let entryLen = 0;
let out;

fs.readdir('./', function(err, files) {
  if (err) {
    throw err;
    return;
  }
  files.forEach(function(x) {
    if (x.match(/^partial-[0-9]+\.json/) !== null) {
      entries.push(x);
    }
  });
  entries.sort(function(a, b) {
    const aNum = parseInt(a.replace('partial-', ''), 10);
    const bNum = parseInt(b.replace('partial-', ''), 10);
    return aNum - bNum;
  });
  entryLen = entries.length;
  read(0, function() {
    console.log(JSON.stringify(out, null, 2));
  });
});

function read(i, cb) {
  if (i >= entryLen) {
    cb();
    return;
  }
  const readStream = fs.createReadStream(entries[i], {encoding: 'utf8'});
  let content = '';
  readStream.on('data', function(chunk) {
    content += chunk;
  });
  readStream.on('end', function() {
    const obj = JSON.parse(content);
    if (out && typeof out === 'object') {
      const partialGeo = obj.features[0].geometry.coordinates[0];
      out.features[0].geometry.coordinates.push(partialGeo);
    } else {
      out = obj;
    }
    read(i + 1, cb);
  });
}
