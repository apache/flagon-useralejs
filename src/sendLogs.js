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

export function initSender(logs, config) {
  sendOnInterval(logs, config);
  sendOnClose(logs, config);
}

export function sendOnInterval(logs, config) {
  setTimeout(function() {
    if (logs.length >= config.logCountThreshold) {
      var data = logs;
      logs = [];
      console.log(data);
      sendLogs(data, config.url, 5);
    }
  }, config.transmitInterval);
}

export function sendOnClose(logs, config) {
  if (navigator.sendBeacon) {
    window.addEventListener('unload', function() {
      navigator.sendBeacon(config.url, JSON.stringify(logs));
    });
  } else {
    window.addEventListener('beforeunload', function() {
      if (logs.length > 0) {
        sendLogs(logs, config.url, 1);
      }
    })
  }
}

export function sendLogs(logs, url, retries) {
  var req = new XMLHttpRequest();

  var data = JSON.stringify(logs);

  req.open('POST', url);
  req.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status !== 200) {
      if (retries > 0) {
        sendLogs(logs, url, retries--);
      }
    }
  };

  req.send(data);
}
