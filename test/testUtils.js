import jsdom from 'jsdom';
import fs from 'fs';

import { version } from '../package.json';

let scriptContent = null;

export function resourceLoader(res, callback) {
  if (scriptContent === null) {
    scriptContent = fs.readFileSync(`build/userale-${version}.min.js`).toString();
  }

  const timeout = setTimeout(function() {
    callback(null, scriptContent);
  }, 0);

  return {
    abort : function() {
      clearTimeout(timeout);
      callback(new Error('Request canceled by user.'));
    },
  }
}

export function createEnv(html, doneCallback, extraConfig) {
  let extra = (typeof extraConfig === 'undefined') ? {} : extraConfig;

  return jsdom.env(Object.assign({}, {
    html : html,
    url : 'http://localhost:8080',
    features : {
      FetchExternalResources : ['script'],
      ProcessExternalResources : ['script']
    },
    resourceLoader,
    done : doneCallback,
  }, extraConfig));
}
