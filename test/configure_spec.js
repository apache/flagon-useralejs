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
import { getUserIdFromParams, configure } from '../src/configure';

describe('configure', () => {
  it('merges new configs into main config object', (done) => {
    const config = {};
    const newConfig = { foo: 'bar' };
    configure(config, newConfig);
    expect(config).to.deep.equal({ foo: 'bar' });
    done();
  });

  it('includes a userid if present in the window.location', (done) => {
    const config = {};
    const newConfig = { foo: 'bar', userFromParams: 'user', };
    const initialWindow = global.window;
    global.window = { location: { href: '?user=test&'} };
    configure(config, newConfig);
    global.window = initialWindow;
    expect(config).to.deep.equal({ foo: 'bar', userFromParams: 'user', userId: 'test' });
    done();
  });

  describe('getUserIdFromParams', () => {
    it('fetches userId from URL params', (done) => {
      const initialWindow = global.window;
      global.window = { location: { href: '?user=foo&'} };
      const userId = getUserIdFromParams('user');
      global.window = initialWindow;
      expect(userId).to.equal('foo');
      done();
    });
    it('returns null if no matching param', (done) => {
      const initialWindow = global.window;
      global.window = { location: { href: '?user=foo&'} };
      const userId = getUserIdFromParams('bar');
      global.window = initialWindow;
      expect(userId).to.equal(null);
      done();
    });
  });
});
