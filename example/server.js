/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var logDirectory = path.resolve(__dirname, '../logs');
var logPath = path.resolve(logDirectory, 'logs_' + (new Date()).getTime() + '.json');

try {
  fs.lstatSync(logDirectory);
} catch (e) {
  fs.mkdirSync(logDirectory); // Create directory if it doesn't exist
}

var wStream = fs.createWriteStream(logPath);
wStream.on('open', function () {
  wStream.write('[');
});

var firstLog = true;
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use('/build', express.static(path.join(__dirname, '/../build')));
app.set('view engine', 'jade');


app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.post('/', function (req, res) {
  console.log(req.body);

  var delimiter = ',\n\t';

  if (firstLog) {
    wStream.write('\n\t');
    firstLog = false;
  } else {
    wStream.write(delimiter);
  }
  
  var logLength = req.body.length - 1;
  req.body.forEach(function (log, i) {
    if (i === logLength) {
      delimiter = '';
    }

    wStream.write(JSON.stringify(log) + delimiter);
  });

  res.sendStatus(200);
});

app.listen(app.get('port'), function () {
  console.log('UserAle Local running on port', app.get('port'));
});

function closeLogServer () {
  wStream.end('\n]');
  process.exit();
}

process.on('SIGTERM', function () { closeLogServer(); });
process.on('SIGINT', function () { closeLogServer(); });
