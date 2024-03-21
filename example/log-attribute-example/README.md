<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
# HTML attribute logging

The following is an example outlining how to log HTML attributes with UserALE.js, and parse some common syntaxs found in attributes.

## Common syntaxes

Consider the following HTML canvas element. This element has a attribute, `data-name`, containing JSON data, `{"name" : "John Doe"}`, with special characters encoded for HTML. And another attribute, `style`, containing CSS formatted data.

```html
<div>
  <canvas id="myCanvas" data-name="&#123;&#34;name&#34;&#58; &#34;John Doe&#34;&#125;" width="200" height="100" style="border:1px solid #000000;"></canvas>
</div>
```

## Extracting and parsing attributes

The following function shows how to extract attributes and parse JSON attribute values. The `style` attribute is excluded because it is handled as a special case in the next code block.

```js

/**
 * Builds an object containing attributes of an element.
 * Attempts to parse all attribute values as JSON text.
 * @param  {Object} e Event from which the target elemnet's attributes should be extracted from.
 * @return {Object} Object with element attributes as key value pairs.
 */
function buildAttrs(e) {
    let attributes = {};
    let attributeBlackList = ["style"];
    if(e.target && e.target instanceof Element) {
        for(attr of e.target.attributes) {
            if(attributeBlackList.includes(attr.name))
                continue;
            let val = attr.value;
            try {
                val = JSON.parse(val);
            } catch (error) {}
            attributes[attr.name] = val;
        }
    }
    return attributes;
}
```

The following function will parse the CSS found in the style attribute.

```js
/**
 * Builds an object containing all css properties of an element.
 * @param  {Object} e Event from which the target elemnet's properties should be extracted from.
 * @return {Object} Object with all CSS properties as key value pairs.
 */
export function buildCSS(e) {
    let properties = {};
    if(e.target && e.target instanceof Element) {
        let styleObj = e.target.style
        for(prop of styleObj) {
            properties[prop] = styleObj.getPropertyValue(prop);
        }
    }
    return properties;
}
```
The above functions can be used in the below snippet to add the results to each log message. In turn, this snippet can be added to a custom.js script to modify core UserALE.js behavior. See the 'index.js' example in this dir. 

```js
window.userale.addCallbacks({
    map(log, e) {
        return {
            ...log,
            attributes: buildAttrs(e),
            style : buildCSS(e),
            logType: 'custom',
        };
    }
});
```