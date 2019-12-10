// Licensed to the Apache Software Foundation (ASF) under one or more
// contributor license agreements.  See the NOTICE file distributed with
// this work for additional information regarding copyright ownership.
// The ASF licenses this file to You under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with
// the License.  You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/** Options API

/**Try out the 'Options' function to change UserALE.js params!*/
const changeMe = "me";
window.userale.options({
    "userId": changeMe,
    "version": "next",
    "sessionID": "this one"
});

/**Filter API

/**Try out the 'Filter' API to eliminate the logs that you don't want!*/
window.userale.filter(function (log) {
    var type_array = ['mouseup', 'mouseover', 'mousedown', 'keydown', 'dblclick', 'blur', 'focus', 'input'];
    var logType_array = ['interval'];
    return !type_array.includes(log.type) && !logType_array.includes(log.logType);
});

/**Log Mapping API

/**Play around with the 'Mapping' API to add or modify existing fields in your logs!*/
/**the example below modifies fields attached to logs on the "Click Me" button on the Example page*/
window.userale.map(function (log, e) {
    var targetsForLabels = ["button#test_button"];
    if (targetsForLabels.includes(log.target)) {
        return Object.assign({}, log, { customLabel: e.target.innerHTML });
    } else {
        return log;
    }
});

/**'Log' API and Custom Log Functions

/**Check out the 'log' API to generate custom events and add them to the log queue! The possibilities are endless
/*You can fully customize your custom logs and define any data schema that suits you*/
/**this example works with the "Test Field" form element on the Example Page*/
document.addEventListener('change', function(e) {
    if (e.target.value === 'log') {
        window.userale.log({
            target: window.userale.getSelector(e.target),
            path: window.userale.buildPath(e),
            type: e.type,
            logType: 'custom',
            userAction: false,
            details: 'I can make this log look like anything I want',
            customField1: 'foo',
            customField2: 'bar',
            userId: window.userale.options().userId,
            toolVersion: window.userale.options().version,
            toolName: window.userale.options().toolName,
            useraleVersion: window.userale.options().useraleVersion,
            sessionID: window.userale.options().sessionID,
            customLabel: "(custom) log Example!"
        });
    }
});

/**Alternatively, you can use UserALE.js' own packaging function for HTML events to strive for standardization!*/
/**this example works with the "Test Field" form element on the Example Page*/
document.addEventListener('change', function(e){
    if (e.target.value === 'packageLog') {
        window.userale.map(function (log) {
            var targetsForLabels = ["packaged this log"];
            if (targetsForLabels.includes(log.details)) {
                return Object.assign({}, log, { logType: 'custom', customLabel: 'packageLog Example' });
            } else {
                return log;
            }
        });
      //  todo figure out passing details output to packagelog window.userale.details(window.userale.options());
        window.userale.packageLog(e, events['change']);
    } else {
        return false
    }
});
/**You can then use the 'Mapping' API function to modify custom logs created with the packageLog function*/


document.addEventListener('change', function(e) {
    if (e.target.value === 'packageCustomLog') {
        window.userale.packageCustomLog({
            customLabel: 'packageCustomLog Example!',
            customField1: 'foo',
            customField2: 'bar'},
            function(){return 'add additional details here!'},
            true
            );
    } else {
        return false
    }
});

// @todo example for extracting text from click events

