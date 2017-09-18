/* eslint-disable */
import * as globals from './globals.js';
import * as MessageTypes from './messageTypes.js';

if (chrome) {
  browser = chrome;
}

// creates a Future for retrieval of the named keys
// the value specified is the default value if one doesn't exist in the storage
let store = browser.storage.local.get({
  userAleHost: globals.userAleHost,
  userAleScript: globals.userAleScript,
  toolUser: globals.toolUser,
  toolName: globals.toolName,
  toolVersion: globals.toolVersion,
}, storeCallback);

function storeCallback(item) {
  document.getElementById("host").value = item.userAleHost;
  document.getElementById("clientScript").value = item.userAleScript;
  document.getElementById("toolUser").value = item.toolUser;
  document.getElementById("toolName").value = item.toolName;
  document.getElementById("toolVersion").value = item.toolVersion;
}

function onError(error) {
  console.log(error);
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

  browser.runtime.sendMessage({ type: MessageTypes.CONFIG_CHANGE, payload: updatedConfig });
}

document.addEventListener("submit", function() {
  saveOptions();
});

/* eslint-enable */
