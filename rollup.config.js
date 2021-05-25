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
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import license from 'rollup-plugin-license'
import copy from 'rollup-plugin-copy'
import {version} from './package.json';

const srcWebExtensionDir = 'src/UserALEWebExtension/'
const buildWebExtensionDir = 'build/UserALEWebExtension/'
const {babel: rollupBabel} = require('@rollup/plugin-babel');

const banner = 'Licensed to the Apache Software Foundation (ASF) under one or more\n' +
    'contributor license agreements.  See the NOTICE file distributed with\n' +
    'this work for additional information regarding copyright ownership.\n' +
    'The ASF licenses this file to You under the Apache License, Version 2.0\n' +
    '(the "License"); you may not use this file except in compliance with\n' +
    'the License.  You may obtain a copy of the License at\n' +
    '\n' +
    'http://www.apache.org/licenses/LICENSE-2.0\n' +
    '\n' +
    'Unless required by applicable law or agreed to in writing, software\n' +
    'distributed under the License is distributed on an "AS IS" BASIS,\n' +
    'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
    'See the License for the specific language governing permissions and\n' +
    'limitations under the License.' +
    '\n@preserved'

export default [
    {
        input: 'src/main.js',
        output: [
            {
                format: 'umd',
                file: `build/userale-${version}.js`,
                name: 'userale',
            }, {
                format: 'umd',
                file: `build/userale-${version}.min.js`,
                name: 'userale',
                plugins: [terser()]
            }
        ],
        plugins: [license({banner}), json(), nodeResolve(), commonjs({include: /node_modules/}),
            rollupBabel({
                babelHelpers: "runtime",
                exclude: /node_modules/,
                plugins: ["@babel/plugin-transform-block-scoping"]
            })]
    },
    ...['content.js', 'background.js', 'options.js'].map(fileName => ({
        input: srcWebExtensionDir + fileName,
        output: {
            format: 'esm',
            file: buildWebExtensionDir + fileName,
            name: 'user-ale-ext-content',
        },
        plugins: [copy({
            targets: [
                {src: srcWebExtensionDir + 'icons/**/*.*', dest: buildWebExtensionDir + 'icons'},
                {src: srcWebExtensionDir + 'manifest.json', dest: buildWebExtensionDir},
                {src: srcWebExtensionDir + 'optionsPage.html', dest: buildWebExtensionDir}
            ],
            copyOnce: true
        }), json(), nodeResolve(), commonjs({include: /node_modules/}),
            rollupBabel({
                babelHelpers: "runtime",
                exclude: /node_modules/,
                plugins: ["@babel/plugin-transform-block-scoping"]
            })
        ]
    }))
];