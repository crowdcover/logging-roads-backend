var express = require('express');
var app = express();
var knex = require('./connection');
var request = require('request');


//CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/all', function(req, res, next) {
  knex('logging.changesets').select()
  .then(function(result){
    res.send(result);
  })
  .catch(function (err) {
        console.log(err);
        next(err);
      });
  
});

app.get('/leaders', function(req, res, next) {


  knex.select(
      'username', 
      'uid',
      knex.raw('SUM(num_changes) as changes'),
      knex.raw('array_agg(tag) as tags'),
      knex.raw('array_agg(changeset_id) as changesets'),
      knex.raw('array_agg(closed_at) as dates')
  )
  .from('logging.changesets')
  .groupByRaw('username, uid')
  .orderByRaw('changes DESC')

  
  .then(function(result){
    res.send(result);
  })
  .catch(function (err) {
        console.log(err);
        next(err);
      });
  
});

app.get('/total', function(req, res, next) {

  knex.select(
      knex.raw('SUM(num_changes) as total')
  )
  .from('logging.changesets')

  
  .then(function(result){
    res.send(result[0]);
  })
  .catch(function (err) {
        console.log(err);
        next(err);
      });
  
});

app.get('/roads', function(req, res, next) {

 knex.select('value')
  .from('logging.stats')
  .where({key: 'totalRoads'})
  .then(function(result){
    res.send(result[0]);
  })
  .catch(function (err) {
    console.log(err);
    next(err);
  });
  
});


app.get('/roadswithstartdate', function(req, res, next) {

 knex.select('value')
  .from('logging.stats')
  .where({key: 'taggedRoads'})
  .then(function(result){    
    res.send(result[0]);
  })
  .catch(function (err) {
    console.log(err);
    next(err);
  });
});


app.listen(3030);