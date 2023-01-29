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
window.userale.map((log, e) => {
    return {
        ...log,
        attributes: buildAttrs(e),
        style : buildCSS(e),
        logType: 'custom',
    };
});
```