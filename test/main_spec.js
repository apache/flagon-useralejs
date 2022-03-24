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
import {expect} from 'chai';
import {createEnvFromFile} from './testUtils';

describe('Userale API', () => {
    const htmlFileName = 'main.html'
    it('provides configs',  async () => {
        const dom = await createEnvFromFile(htmlFileName)
        const config = dom.window.userale.options();
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
            'authHeader',
            'custIndex'
        ]);
        dom.window.close();
    });

    it('edits configs', async () => {
        const dom = await createEnvFromFile(htmlFileName)
        const config = dom.window.userale.options();
        const interval = config.transmitInterval;
        dom.window.userale.options({
            transmitInterval: interval + 10
        });
        const newConfig = dom.window.userale.options();

        expect(newConfig.transmitInterval).to.equal(interval + 10);
        dom.window.close();
    });

    it('disables autostart', async () => {
        const dom = await createEnvFromFile(htmlFileName)
        dom.window.userale.options({
            autostart: false
        });
        const newConfig = dom.window.userale.options();

        expect(newConfig.autostart).to.equal(false);
        dom.window.close();
    });

    it('starts + stops', async () => {
        const dom = await createEnvFromFile(htmlFileName)
        setTimeout(() => {
            const {userale} = dom.window;
            expect(userale.options().on).to.equal(true);

            userale.stop();
            expect(userale.options().on).to.equal(false);

            userale.start();
            expect(userale.options().on).to.equal(true);

            dom.window.close();
        }, 200);
    });

    it('sends custom logs', async () => {
        const dom = await createEnvFromFile(htmlFileName)
        const {userale} = dom.window;

        expect(userale.log({})).to.equal(true);
        expect(userale.log()).to.equal(false);
        expect(userale.log(null)).to.equal(false);

        dom.window.close();
    });
});
