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
import jsdom from 'jsdom';
import fs from 'fs';
import Storage from 'dom-storage';

import { version } from '../package.json';

let scriptContent = null;

export function resourceLoader(res, callback) {
  if (scriptContent === null) {
    scriptContent = fs.readFileSync(`build/userale-${version}.min.js`).toString();
  }

  const timeout = setTimeout(() => {
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
  const extra = (typeof extraConfig === 'undefined') ? {} : extraConfig;
  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.sendTo(console);

  return jsdom.env(Object.assign({}, {
    html: html,
    url: 'http://localhost:8080',
    features : {
      FetchExternalResources : ['script'],
      ProcessExternalResources : ['script']
    },
    resourceLoader,
    created: (err, window) => {
      if (err) {
        throw err;
      }

      window.sessionStorage = new Storage(null, { strict: true });
    },
    done: doneCallback,
    virtualConsole,
  }, extraConfig));
}
