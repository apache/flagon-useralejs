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
import { attachHandlers } from '../src/attachHandlers';
import * as packager from '../src/packageLogs';

describe('attachHandlers', () => {
  it('attaches all the event handlers without duplicates', (done) => {
    let duplicateEvents = 0;
    const initialDocument = global.document;
    const initialWindow = global.window;
    // List of supported document events
    const missingDocumentEvents = [
      'click', 'dblclick', 'mousedown', 'mouseup', 'focus', 'blur',
      'input', 'change', 'dragstart', 'dragend', 'drag', 'drop',
      'keydown', 'mouseover', 'submit'
    ];

    // List of supported window events
    const missingWindowEvents = ['wheel', 'scroll', 'resize', 'load', 'blur', 'focus'];

    // List of supported interval events
    const missingIntervalEvents = ['click', 'focus', 'blur', 'input', 'change', 'mouseover', 'submit'];

    // Acts as a kind of Proxy for addEventListener. Keeps track of added listeners.
    const listenerHook = eventList => (ev) => {
      const evIndex = eventList.indexOf(ev);
      if (evIndex !== -1) {
        eventList.splice(evIndex, 1);
      } else {
        duplicateEvents++;
      }
    };

    const missingDocumentAndIntervalEvents = missingDocumentEvents.concat(missingIntervalEvents);

    // MOCK
    global.document = { addEventListener: listenerHook(missingDocumentAndIntervalEvents) };
    global.window = { addEventListener: listenerHook(missingWindowEvents) };
    attachHandlers({ logDetails: true });
    expect(duplicateEvents).to.equal(0);
    expect(missingDocumentAndIntervalEvents.length).to.equal(0);
    expect(missingWindowEvents.length).to.equal(0);

    // UNMOCK
    global.document = initialDocument;
    global.window = initialWindow;
    done();
  });
  it('debounces bufferedEvents', (done) => {
    let callCount = 0;
    let testingEvent = false;
    const bufferedEvents = ['wheel', 'scroll', 'resize'];
    const initialWindow = global.window;
    const initialDocument = global.document;
    const rate = 500;
    const initialPackage = packager.packageLog;
    packager.packageLog = () => { callCount++; };
    global.document = { addEventListener: () => {} };
    // Tries to call an event 3 times. Twice in quick succession, then once after the set delay.
    // Number of actual calls to packageLog are recorded in callCount. Should amount to exactly 2 calls.
    global.window = {
      addEventListener: (ev, fn, ...args) => {
        if (!testingEvent && bufferedEvents.indexOf(ev) !== -1) {
          testingEvent = true;
          fn();
          fn();
          setTimeout(() => {
            fn();
            global.window = initialWindow;
            global.document = initialDocument;
            packager.packageLog = initialPackage;
            expect(callCount).to.equal(2);
            done();
          }, rate + 1);
        }
      }
    };
    attachHandlers({ resolution: rate });
  });

  describe('defineDetails', () => {
    // TODO: clarify what constitutes "high detail events" and what is "correct"
    it('configures high detail events correctly');
  });
});
