// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('mydb', ['contactlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

app.get('/contactlist', function (req, res) {
  console.log('I received a GET request');

  db.contactlist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/contactlist', function (req, res) {
  console.log(req.body);
  db.contactlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.contactlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});


//////////////////////////////////

db1 = mongojs('mydb', ['aqi_bj']);

app.get('/test', function (req, res) {
  console.log('test------------');

db1.aqi_bj.aggregate( [
                        { $match : { avgaqi: { $gt : 150} , year: 2008, month:4} },
                        { $group: { _id: null, count: { $sum: 1 } } }
                      ], 
                       function (err, docs) {
                          console.log(docs);
                          res.json(docs);
                        }
                    );
});

app.get('/aqidata', function (req, res) {
  console.log('aqidata------------');

  db1.aqi_bj.find().limit(10,
    function (err, docs) {
    res.json(docs);
    }
  );
});

app.get('/aqipie', function (req, res) {

  console.log(req.query);  console.log(req.params);


  var iyear = parseInt(req.query.year);
  var imonth = parseInt(req.query.month);


  db1.aqi_bj.find({year:iyear,month:imonth},
    function (err, docs) {

      
      var a = b = c = d = e = f = 0;
      console.log(docs);
      for (var i = docs.length - 1; i >= 0; i--) {

        var aqi = docs[i].avgaqi;
        if (aqi <= 50) {
          a++;
        };
        if (aqi <= 100 && aqi >50) {
          b++;
        };
        if (aqi <= 150 && aqi >100) {
          c++;
        };
        if (aqi <= 200 && aqi >150) {
          d++;
        };
        if (aqi <= 300 && aqi >200) {
          e++;
        };
        if (aqi >300) {
          f++;
        };
        var ret = [a,b,c,d,e,f];
      };

    res.json(ret);
    }
  );
});






app.listen(3000);
console.log("Server running on port 3000");