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
import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

import { createEnv } from './testUtils';

describe('Userale API', () => {
  const url = 'file://' + __dirname + '/main.html';
  const html = fs.readFileSync(__dirname + '/main.html');
  const features = {
    FetchExternalResources : ['script'],
    ProcessExternalResources : ['script']
  };

  it('provides configs', (done) => {
    createEnv(html, (err, window) => {
      const config = window.userale.options();
      expect(config).to.be.an('object');
      expect(config).to.have.all.keys([
        'on',
        'useraleVersion',
        'autostart',
        'url',
        'transmitInterval',
        'logCountThreshold',
        'userId',
        'sessionID',
        'version',
        'logDetails',
        'resolution',
        'toolName',
        'userFromParams',
        'time',
      ]);
      window.close();
      done();
    });
  });

  it('edits configs', (done) => {
    createEnv(html, (err, window) => {
      const config = window.userale.options();
      const interval = config.transmitInterval;
      window.userale.options({
        transmitInterval : interval + 10
      });
      const newConfig = window.userale.options();

      expect(newConfig.transmitInterval).to.equal(interval + 10);
      window.close();
      done();
    });
  });

  it('starts + stops', (done) => {
    createEnv(html, (err, window) => {
      setTimeout(() => {
        const { userale } = window;
        expect(userale.options().on).to.equal(true);

        userale.stop();
        expect(userale.options().on).to.equal(false);

        userale.start();
        expect(userale.options().on).to.equal(true);

        window.close();
        done();
      }, 200);
    });
  });

  it('sends custom logs', (done) => {
    createEnv(html, (err, window) => {
      const { userale } = window;

      expect(userale.log({})).to.equal(true);
      expect(userale.log()).to.equal(false);
      expect(userale.log(null)).to.equal(false);

      window.close();
      done();
    });
  });
});
