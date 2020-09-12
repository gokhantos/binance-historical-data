const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
let ethdata = require('./ETHUSDT-1d.json');

let myJSON = JSON.parse(fs.readFileSync(__dirname + '/ETHUSDT-1d.json', 'utf-8'));

function convertToJSON(array) {
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    var key = "timestamp";
    var key2 = "open";
    var key3 = "high";
    var key4 = "low";
    var key5 = "close";
    var key6 = "volume";
    objArray[i - 1][key] = array[i][0];
    objArray[i - 1][key2] = array[i][1];
    objArray[i - 1][key3] = array[i][2];
    objArray[i - 1][key4] = array[i][3];
    objArray[i - 1][key5] = array[i][4];
    objArray[i - 1][key6] = array[i][5];
  }

  return objArray;
}
myJSON = convertToJSON(myJSON);

const uri = "MONGODB_URI";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });
client.connect(err => {
  client.db('crypto')
    .collection('ethusdt')
    .insertMany(myJSON, (err, res) => {
      console.log(err);
      client.close();
    })
});
