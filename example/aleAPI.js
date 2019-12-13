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
 *
 * the 'options' API allows you to dynamically change UserALE.js params and set meta data values
 *pass in variables or properties into the options object, such as sessionStorage or localStorage
 */
const changeMe = "me";
window.userale.options({
    "userId": changeMe,
    "version": "next",
    "logDetails": "true",
    "sessionID": "this one"
});

/**Filter API

/**the 'filter' API allows you to eliminate logs you don't want
 *use as a global filter and add classes of events or log types to eliminate
 *or use in block scope to surgically eliminate logs from specific elements from an event handler
 */
window.userale.filter(function (log) {
    var type_array = ['mouseup', 'mouseover', 'mousedown', 'keydown', 'dblclick', 'blur', 'focus'];
    var logType_array = ['interval'];
    return !type_array.includes(log.type) && !logType_array.includes(log.logType);
});

/**Log Mapping API
 *
 * the 'map' API allows you to add or modify new fields to your logs
 * this example works with the "Click Me!" button at the top of index.html
 */
 document.addEventListener('click', function(e){
    if (e.target.innerHTML === 'Click Me!') {
        window.userale.map(function (log) {
            return Object.assign({}, log, { logType: 'custom', customLabel: 'map & packageLog Example' });
        });
        window.userale.packageLog(e, window.userale.details(window.userale.options(),'click'));
    } else {
        return false
    }
});

/** Alternate Log Mapping API Example
 * Build a global mapping function with conditional logic to modify logs for similar events
 * this example works with the "Click Me!" button at the top of index.html
 */
//window.userale.map(function (log, e) {
//    var targetsForLabels = ["button#test_button"];
//    if (targetsForLabels.includes(log.target)) {
//        return Object.assign({}, log, { customLabel: e.target.innerHTML });
//    } else {
//        return log;
//    }
//});

/**'Log' API and Custom Log Functions
 *
 * the 'log' API generate custom events and add them to the log queue
 * pass in any keys:values for fully customized logs
 * utilize 'options' and other functions to streamline populating custom logs
 * type 'log' into the 'API Test Field' to see this custom log sent to our example server
 */
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

/**you can also use UserALE.js' own packaging function for HTML events to strive for standardization
 * type 'packageLog into the 'API Test Field' to see this custom log sent to our example server
 */
document.addEventListener('change', function(e){
    if (e.target.value === 'packageLog') {
        /**You can then use the 'Mapping' API function to modify custom logs created with the packageLog function*/
        window.userale.map(function (log) {
            var targetsForLabels = ['change'];
            if (targetsForLabels.includes(log.type)) {
                return Object.assign({}, log, { logType: 'custom', customLabel: 'packageLog Example' });
            } else {
                return log;
            }
        });
        /**You can also use the details function to package additional log meta data, or add custom details*/
        window.userale.packageLog(e, window.userale.details(window.userale.options(),'change'));
    } else {
        return false
    }
});

/**you can also just add boilerplate UserALE.js meta data to custom logs with the packageCustomLog function
 * type 'packageCustomLog into the 'API Test Field' to see this custom log sent to our example server
 */
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