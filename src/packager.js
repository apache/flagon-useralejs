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

export var logs = [];
var config = {};


export function emptyLogs () {
  logs = [];
}

export function currentLogCount () {
  return logs.length;
}


export function setConfigs (c) {
  config = c;
}


function getSelector (ele) {
  if (ele.localName) {
    return ele.localName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
  } else if (ele.nodeName) {
    return ele.nodeName;
  } else if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return "Window";
  } else {
    return "Unknown";
  }
}


function selectorizePath (path) {
  if (path) {
    return path.map(function (pathEle) {
      return getSelector(pathEle);
    });
  } else {
    return null;
  }
}


function getLocation (e) {
  if (e.pageX != null) {
    return { 'x' : e.pageX, 'y' : e.pageY };
  } else if (e.clientX != null) {
    return { 'x' : document.documentElement.scrollLeft + e.clientX, 'y' : document.documentElement.scrollTop + e.clientY };
  } else {
    return { 'x' : null, 'y' : null };
  }
}


export function packager (e, detailAccessor) {
  var details = null;
  if (detailAccessor) {
    details = detailAccessor(e);
  }

  var log = {
    'target' : getSelector(e.target),
    'path' : selectorizePath(e.path),
    'clientTime' : (e.timeStamp && e.timeStamp > 0) ? config.time(e.timeStamp) : Date.now(),
    'location' : getLocation(e),
    'type' : e.type,
    'userAction' : true,
    'details' : details,
    'userId' : config.userId,
    'toolVersion' : config.version
  };

  logs.push(log);
}
