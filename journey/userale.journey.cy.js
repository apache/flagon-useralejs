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
import { validate } from 'jsonschema';

describe('Userale logging', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:8000/').as('backend')
    })

    it('sends a page load log', () => {
        cy.visit('http://localhost:8000')
        cy.wait('@backend').then(xhr => {
            const body = xhr.request.body
            const pageLoadLog = body[0]
            expect(pageLoadLog['details']['pageLoadTime']).to.be.greaterThan(0)
            expect(pageLoadLog).to.contain({
                logType: 'custom',
                type: 'load'
            })
        })
    });

    it('builds the correct path in a log', () => {
        cy.visit('http://localhost:8000')
        cy.wait('@backend')
        cy.contains(/click me/i).click()
        cy.wait('@backend').then(xhr => {
            const body = xhr.request.body
            const buttonClickLog = body.find(log => log.target === 'button#test_button')
            const actualPath = buttonClickLog.path
            const expectedPath = ["button#test_button", "div.container", "body", "html", "#document", "Window"]
            expect(actualPath).to.deep.equal(expectedPath)
        })
    });

    it('executes added callbacks', () => {
        cy.visit('http://localhost:8000')
        cy.wait('@backend')
        cy.contains(/click me/i).click()
        cy.wait('@backend').then(xhr => {
            const body = xhr.request.body
            const buttonClickLog = body.find(
                log => log.target === 'button#test_button'
                && log.logType === 'custom')
                
            expect(buttonClickLog).to.have.property('customLabel');

            const actualValue = buttonClickLog.customLabel
            const expectedValue = 'map & packageLog Example'
            expect(actualValue).to.equal(expectedValue)
        })
    });

    it('produces valid logs', () => {
        cy.visit('http://localhost:8000');
        cy.wait('@backend').then(xhr => {
            var schema = require('../example/log.schema.json');
            for(const log of xhr.request.body) {
                const result = validate(log, schema);
                expect(result.valid, result.errors).to.equal(true);
            }
        })
        cy.contains(/click me/i).click();
        cy.wait('@backend').then(xhr => {
            var schema = require('../example/log.schema.json');
            for(const log of xhr.request.body) {
                const result = validate(log, schema);
                expect(result.valid, result.errors).to.equal(true);
            }
        })
    });

});
