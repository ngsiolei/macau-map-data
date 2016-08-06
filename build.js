var fs = require('fs');
var entries = [];
var entryLen = 0;
var out;

fs.readdir('./', function (err, files) {
  if (err) {
    throw err;
    return;
  }
  files.forEach(function (x) {
    if (x.match(/^partial-[0-9]+\.json/) !== null) {
      entries.push(x);
    }
  });
  entries.sort(function (a, b) {
    var aNum = parseInt(a.replace('partial-', ''), 10);
    var bNum = parseInt(b.replace('partial-', ''), 10);
    return aNum - bNum;
  });
  entryLen = entries.length;
  read(0, function () {
    console.log(JSON.stringify(out, null, 2));
  });
});

function read(i, cb) {
  if (i >= entryLen) {
    cb();
    return;
  }
  var readStream = fs.createReadStream(entries[i], {'encoding': 'utf8'});
  var content = ''; 
  readStream.on('data', function (chunk) {
    content += chunk;
  });
  readStream.on('end', function () {
    var obj = JSON.parse(content);
    if (out && typeof out === 'object') {
      var partialGeo = obj.features[0].geometry.coordinates[0];
      out.features[0].geometry.coordinates.push(partialGeo);
    } else {
      out = obj;
    }
    read(i + 1, cb);
  });
}
