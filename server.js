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

db1 = mongojs('mydb', ['aqi']);

app.get('/test', function (req, res) {
  console.log('test------------');

db1.aqi.aggregate( [
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

  db1.aqi.find().limit(10,
    function (err, docs) {
    res.json(docs);
    }
  );
});

app.get('/aqipie', function (req, res) {

  console.log(req.query);  console.log(req.params);

  var city = req.query.city;
  var iyear = parseInt(req.query.year);
  var imonth = parseInt(req.query.month);


  db1.aqi.find({city:city,year:iyear,month:imonth},
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


app.get('/aqiline_m', function (req, res) {

  console.log(req.query);  
  console.log(req.params);

  var city = req.query.city;
  var iyear = parseInt(req.query.year);
  var imonth = parseInt(req.query.month);


  db1.aqi.find({city:city,year:iyear,month:imonth},
    function (err, docs) {

      var days = [];
      var aqimax = [];
      var aqimin = [];
      var aqiavg = [];
      console.log(docs);
      for (var i = 0; i < docs.length; i++) {

        days.push(docs[i].day);
        aqiavg.push(docs[i].avgaqi);
        aqimin.push(docs[i].minaqi);
        aqimax.push(docs[i].maxaqi);
       
      };
      var ret = {'days':days,'aqimax':aqimax,'aqimin':aqimin,'aqiavg':aqiavg};


    res.json(ret);
    }
  );
});



app.get('/aqi_m', function (req, res) {

  console.log(req.query);  
  console.log(req.params);


  var city = req.query.city;
  var iyear = parseInt(req.query.year);
  var imonth = parseInt(req.query.month);


  db1.aqi.find({city:city,year:iyear,month:imonth},
    function (err, docs) { 
      console.log(docs);
      res.json(docs);
    }
  );
});


app.get('/aqi_y', function (req, res) {

  console.log(req.query);  
  console.log(req.params);


  var city = req.query.city;
  var iyear = parseInt(req.query.year);
  db1.aqi.find({city:city,year:iyear},
    function (err, docs) { 
      console.log(docs);
      res.json(docs);
    }
  );
});


//generate aqi_y data
app.get('/aqi_all', function (req, res) {


  db1.aqi_bj.find(
    function (err, docs) { 
  
      var a = b = c = d = e = f = 0;
      var dataByMonth = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
      var dataByLevel = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
      console.log(docs);
      for (var i = docs.length - 1; i >= 0; i--) {

            var aqi = docs[i].avgaqi;
            if (aqi <= 50) {
              a++;
              dataByLevel[0][docs[i].year-2008]++;
            };
            if (aqi <= 100 && aqi >50) {
              b++;
              dataByLevel[1][docs[i].year-2008]++;
            };
            if (aqi <= 150 && aqi >100) {
              c++;
              dataByLevel[2][docs[i].year-2008]++;
            };
            if (aqi <= 200 && aqi >150) {
              d++;
              dataByLevel[3][docs[i].year-2008]++;
            };
            if (aqi <= 300 && aqi >200) {
              e++;
              dataByLevel[4][docs[i].year-2008]++;
            };
            if (aqi >300) {
              f++;
              dataByLevel[5][docs[i].year-2008]++;
            };
      };
        res.json(dataByLevel);
      }
    
  );
});

db2 = mongojs('mydb', ['aqi_y']);

app.get('/aqi_all_y', function (req, res) {

  var icity = req.query.city;


  db2.aqi_y.find({city:icity},
    function (err, docs) { 
      console.log(docs);
      res.json(docs);
    }
  );
});

//realtime aqi
var db3 = mongojs('mydb', ['aqi_hour']);
db2.on('error', function(err) {
    console.log('database error', err);
});

app.get('/aqi_d', function (req, res) {
  db3.on('error', function(err) {
      console.log('database error', err);
  });
  db3.on('ready', function(err) {
      console.log('database ready', err);
  });


  var icity = req.query.city;
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  //db.aqi_hour.find({year:2015,month:8,day:22}).sort({hour:1})
  db3.aqi_hour.find({city:icity,year:year,month:month,day:day}).sort({hour:-1},
    function (err, docs) { 
      console.log(docs);
      res.json(docs);
    }
  );
});

app.listen(3000);
console.log("Server running on port 3000");