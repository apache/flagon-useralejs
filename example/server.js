// Copyright 2016 The Charles Stark Draper Laboratory
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

app.get('/', function (req, res) {
  res.send('UserAle Local');
});

app.post('/logs', function (req, res) {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(app.get('port'), function () {
  console.log('UserAle Local running on port', app.get('port'));
});
