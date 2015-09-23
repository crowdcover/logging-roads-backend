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
    res.send(result);
  })
  .catch(function (err) {
        console.log(err);
        next(err);
      });
  
});

app.get('/roads', function(req, res, next) {

 var query = 
' [out:json]; ' +
'(' +
'way["highway"="track"]["access"="forestry"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["highway"="track"]["access"="agriculture"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["abandoned:highway"="track"]["access"="forestry"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["abandoned:highway"="track"]["access"="agricultural"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'); ' +
'out count; ';

 request.post('http://overpass-api.de/api/interpreter', function (error, response, body) {
 

        if (!error && response.statusCode === 200) {
            res.send(body);
        } else if (error) {
            next(error);
        } else if (response) {
            next({
                message: 'Request failed: HTTP ' + response.statusCode,
                statusCode: response.statusCode
            });
        } else {
            next({
                message: 'Unknown error.',
            });
        }
    }).form({
        data: query
    });
  
});


app.get('/roadswithstartdate', function(req, res, next) {

 var query = 
' [out:json]; ' +
'(' +
'way["highway"="track"]["access"="forestry"]["start_date"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["highway"="track"]["access"="agriculture"]["start_date"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["abandoned:highway"="track"]["access"="forestry"]["start_date"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'way["abandoned:highway"="track"]["access"="agricultural"]["start_date"]( -14.093957177836224,7.470703125,10.919617760254697,36.03515625 ); ' +
'); ' +
'out count; ';

 request.post('http://overpass-api.de/api/interpreter', function (error, response, body) {
 

        if (!error && response.statusCode === 200) {
            res.send(body);
        } else if (error) {
            next(error);
        } else if (response) {
            next({
                message: 'Request failed: HTTP ' + response.statusCode,
                statusCode: response.statusCode
            });
        } else {
            next({
                message: 'Unknown error.',
            });
        }
    }).form({
        data: query
    });
  
});


app.listen(3030);