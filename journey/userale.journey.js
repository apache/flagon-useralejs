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
describe('Userale logging', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:8000/').as('backend')
    })

    it('sends a page load log', () => {
        cy.visit('http://localhost:8000')
        cy.wait('@backend').then(xhr => {
            const body = xhr.request.body
            const pageLoadLog = body[0]
            expect(pageLoadLog['pageLoadTime']).to.be.greaterThan(0)
            expect(pageLoadLog).to.contain({
                logType: 'raw',
                type: 'load'
            })
        })
    });
});