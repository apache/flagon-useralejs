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

export function configure(config, newConfig) {
  Object.keys(newConfig).forEach(function(option) {
    if (option === 'userFromParams') {
      var userId = getUserIdFromParams(newConfig[option]);
      if (userId) {
        config.userId = userId;
      }
    }
    config[option] = newConfig[option];
  });
}

export function getUserIdFromParams(param) {
  var userField = param;
  var regex = new RegExp('[?&]' + userField + '(=([^&#]*)|&|#|$)');
  var results = window.location.href.match(regex);

  if (results && results[2]) {
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  } else {
    return null;
  }
}
