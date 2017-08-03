# UserALE Web Extension

There are many different ways to create extensions/plugins for Firefox. This project follows the Web Extension way.

For installation and other help, check out the Mozilla Developer Network (MDN) website:
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension

## Folder/file structure

* ../
    * The parent directory should be the src for the core of UserALE
* README.md
    * You're looking at me!
* icons/
    * Used by the web extension to load icon resources.
* public/
    * Used for sample/test webpages and resources. Not actually part of the Firefox plugin! Used by NPM's http-server module (and other web servers).
* globals.js
    * Holds default values for the web extension's options.
* manifest.json 
    * The main web extension project file, where it all begins.
* options.js
    * JavaScript code used by the web extension's options page.
* optionsPage.html
    * HTML for the options page.
* user-ale-ext.js
    * The JavaScript code used by the web extension.
* userale-0.2.1.min.js
    * The User ALE client script, loaded by the web extension.

## Quick Start

1. You need to have a UserALE server running; one way is to Git clone the UserALE repository (which if this README is on your filesystem, you've already done so), run the build, and then start the included test server.
    1. git clone https://github.com/apache/incubator-senssoft-useralejs.git
    1. cd incubator-senssoft-useralejs
    1. npm install && npm run build
    1. npm run example:watch
    1. UserALE should now be running on http://localhost:8000
1. Start a simple server to serve up the test page.
    1. cd src/UserAleWebExtension/
    1. npm install -g http-server
    1. http-server
    1. Test page should now be available at http://localhost:8080/index.html
    1. NOTE: this test page is served up from the source directory and is NOT copied into the build directory because it is not part of the actual distriubtion.
1. Load the web extension into Firefox.
    1. Option 1: use npm's web-ext
        1. cd build/UserAleWebExtension/
        1. npm install -g web-ext
        1. web-ext run --browser-console --start-url localhost:8080
    1. Option 2: manual loading
        1. Open Firefox
        1. Enter about:debugging into the URL bar and press enter
        1. Check the box to 'Enable add-on debugging'
        1. Press the 'Load Temporary Add-on' button
        1. Navigate to the root of the web extension directory (e.g. 'build/UserAleWebExtension')
        1. Press Open, and confirm that 'User ALE Extension' appears in the list
        1. You may now navigate to a web page to inject the User ALE script! (e.g. http://localhost:8080)
        
## Options

You can set options for the web extension in Firefox by opening the menu, clicking on "Add-ons", then "Extensions". You should see the User ALE Web Extension listed and then you can click on the "Preferences" button to open up the options.

You can also simply enter "about:addons" in the URL bar, then click on "Extensions" to achieve the same result.

## Google Chrome

You can load the web extension into Google Chrome with the following procedure:

1. Within Chrome, open the menu, expand 'More tools...', and click on 'web extensions.'
1. Enable developer mode by checking the box at the top of the page.
1. Select the root of the web extension directory.
1. Navigate to the test page (e.g. http://localhost:8080/index.html) to inject UserALE into the page.
    
## Updating UserALE client script

This version of the web extension has been modified to automatically reflect the correct version of the UserALE core script during the build process. You should not need to change anything for it to "just work".

However, if something appears wrong, you can look at the 'src/UserAleWebExtension/globals.js' and 'src/UserAleWebExtension/manifest.json' to see how the UserALE client script is being set. Also look at the build steps related to the web extension in 'gulpfile.js' to see how the two previously mentioned files are modified to reflect the current version of the UserALE client script.