/* eslint-disable */

// these are default values, which can be overridden by the user on the options page
var userAleHost = 'http://localhost:8000';
var userAleScript = 'userale-0.2.1.min.js';
var toolUser = 'nobody';
var toolName = 'test_app';
var toolVersion = '0.1.0';

/* eslint-enable */

var prefix = 'USERALE_';

var CONFIG_CHANGE = prefix + 'CONFIG_CHANGE';

if (chrome) {
  browser = chrome;
}

// creates a Future for retrieval of the named keys
// the value specified is the default value if one doesn't exist in the storage
let store = browser.storage.local.get({
  userAleHost: userAleHost,
  userAleScript: userAleScript,
  toolUser: toolUser,
  toolName: toolName,
  toolVersion: toolVersion,
}, storeCallback);

function storeCallback(item) {
  document.getElementById("host").value = item.userAleHost;
  document.getElementById("clientScript").value = item.userAleScript;
  document.getElementById("toolUser").value = item.toolUser;
  document.getElementById("toolName").value = item.toolName;
  document.getElementById("toolVersion").value = item.toolVersion;
}

function saveOptions(e) {
  const updatedConfig = {
    userAleHost: document.getElementById("host").value,
    userAleScript: document.getElementById("clientScript").value,
    toolUser: document.getElementById("toolUser").value,
    toolName: document.getElementById("toolName").value,
    toolVersion: document.getElementById("toolVersion").value,
  };

  browser.storage.local.set(updatedConfig);

  browser.runtime.sendMessage({ type: CONFIG_CHANGE, payload: updatedConfig });
}

document.addEventListener("submit", function() {
  saveOptions();
});

/* eslint-enable */