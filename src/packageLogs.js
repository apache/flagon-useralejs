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

var logs;
var config;

export function initPackager(newLogs, newConfig) {
  logs = newLogs;
  config = newConfig;
}

export function packageLog(e, detailFcn) {
  if (!config.on) {
    return false;
  }

  var details = null;
  if (detailFcn) {
    details = detailFcn(e);
  }

  var log = {
    'target' : getSelector(e.target),
    'path' : buildPath(e),
    'clientTime' : (e.timeStamp && e.timeStamp > 0) ? config.time(e.timeStamp) : Date.now(),
    'location' : getLocation(e),
    'type' : e.type,
    'userAction' : true,
    'details' : details,
    'userId' : config.userId,
    'toolVersion' : config.version,
    'toolName' : config.toolName,
    'useraleVersion': config.useraleVersion
  };

  logs.push(log);

  return true;
}

export function getLocation(e) {
  if (e.pageX != null) {
    return { 'x' : e.pageX, 'y' : e.pageY };
  } else if (e.clientX != null) {
    return { 'x' : document.documentElement.scrollLeft + e.clientX, 'y' : document.documentElement.scrollTop + e.clientY };
  } else {
    return { 'x' : null, 'y' : null };
  }
}

export function getSelector(ele) {
  if (ele.localName) {
    return ele.localName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
  } else if (ele.nodeName) {
    return ele.nodeName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
  } else if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return "Window";
  } else {
    return "Unknown";
  }
}

export function buildPath(e) {
  var path = [];
  if (e.path) {
    path = e.path;
  } else {
    var ele = e.target
    while(ele) {
      path.push(ele);
      ele = ele.parentElement;
    }
  }

  return selectorizePath(path);
}

export function selectorizePath(path) {
  return path.map(function(pathEle) {
    return getSelector(pathEle);
  });
}
