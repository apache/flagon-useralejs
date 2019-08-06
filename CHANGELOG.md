Changelog
=========

Apache Flagon UserALE.js (Incubating) 2.0.1 (2019-08-05)
-------------------------------
* Release Notes - Flagon - Version UserALE.js 2.0.2
* [Release Report](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12320621&version=12345954)

* Sub-task
    * [FLAGON-423] - Update Package File to Fix Down Stream Dependencies
    
* Bug
    * [FLAGON-422] - Update NPM modules to fix prototype pollution issues in npm packages
    * [FLAGON-433] - FIx Package.json and Package-Log.json to resolve npm packaging issue

* Improvement
    * [FLAGON-432] - Improve UserALEjs Example Server Instructions

* Task
    * [FLAGON-424] - Update Gulp to 4.0.2 as matter of protocol post Prototype Pollution.
    * [FLAGON-425] - Update gulp-eslint
    * [FLAGON-426] - update rollup 
    * [FLAGON-427] - update nodemon
    * [FLAGON-428] - update sinon
    * [FLAGON-429] - test userale.js builds and artifacts on npm 6.10
    * [FLAGON-430] - update rollup-plugin-license
    
Apache Flagon UserALE.js (Incubating) 2.0.0 (2019-06-20)
-------------------------------
* Release Notes - Flagon - Version UserALE.js 2.0.0
* [Release Report](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12320621&version=12343068)

* Sub-task
    * [FLAGON-220] - Add interval log timeout
    * [FLAGON-231] - Add Micro Second Field in UserALE.js to cover Elastic indexing and time encoding issues.
    * [FLAGON-240] - Update Elasticsearch mapping to accurately parse clientTime variable from userale.js
    * [FLAGON-333] - Add pageURL to UserALE.js logs
    * [FLAGON-334] - Add pageTitle to UserALE.js
    * [FLAGON-337] - Add pageReferrer to UserALE.js 

* Bug
    * [FLAGON-79] - clientTime is not properly formmated 
    * [FLAGON-167] - Browser plugin CORS permissions
    * [FLAGON-169] - Browser Blocking Mixed Content
    * [FLAGON-221] - Elasticsearch 5.x does not support microsecond precision
    * [FLAGON-321] - Gulp Mocha Dependency Deprecation: Critical Command Injection Vulnerability
    * [FLAGON-322] - minimatch deprecation: ReDOS vulnerability
    * [FLAGON-323] - Update to Gulp 4.0.0
    * [FLAGON-324] - Example Page Does Not Generate Logs
    * [FLAGON-338] - Mocha unit tests treat 'document' and 'window' as 'Undefinied' vars 
    * [FLAGON-340] - UserALE.js fails to build on Branch-336

* New Feature
    * [FLAGON-29] - Determine how best to track sessions and users
    * [FLAGON-166] - Build Firefox Plugin that Deploys UserALE.min Script Tag (.js Use Case)
    * [FLAGON-173] - Provide Options page for Web Extension plugin
    * [FLAGON-192] - Record Interval Events
    * [FLAGON-232] - Explore options for capturing unique UserIDs (distinguishing browsers) at runtime.
    * [FLAGON-328] - Page Sessions in UserALE.js
    * [FLAGON-336] - Document Meta-Data on UserALE.js Logs

* Improvement
    * [FLAGON-99] - Add custom log API method
    * [FLAGON-175] - Integrate web extension with existing User ALE build process
    * [FLAGON-196] - UserALE.js time sync
    * [FLAGON-217] - Track what type of change occurred in UserALE.js
    * [FLAGON-238] - Integrate Plugin Build Processes into NPM Build process
    * [FLAGON-271] - Investigate workflow for adding Chrome plugin to Chrome Store
    * [FLAGON-376] - Add pre-build UserALE.js in src

* Test
    * [FLAGON-174] - Test web extension with Chrome
    * [FLAGON-183] - [RELEASE PROC] Verify UserALE.js Unit Tests for -192 Branch

* Task
    * [FLAGON-93] - Readme Documentation of JS API
    * [FLAGON-223] - Make UserALE.js plugin persistent
    * [FLAGON-224] - Update UserALE.js Browser Plugin to Save Operating Params
    * [FLAGON-239] - Submit Firefox Extension to Firefox Verification
    * [FLAGON-285] - Address WARN deprecated during npm install
    * [FLAGON-289] - Remove Logstash Dependency for Header Requests
    * [FLAGON-294] - Branch Management
    * [FLAGON-345] - Update README.md files to Apache Flagon
    * [FLAGON-383] - Update README.md and Notices to Reflect Flagon namechange
    * [FLAGON-385] - Add Package-lock.json file to repos
    * [FLAGON-392] - Clean up for Merge with master
    * [FLAGON-396] - Add License to testUtils
    * [FLAGON-397] - Add Apache License headers to pre-built Artifacts
    * [FLAGON-399] - Update DOAP to reflect new version
    * [FLAGON-400] - Update Gulpfile to Add License to Build Artifacts
    * [FLAGON-401] - Add License to WebExtension Files
    * [FLAGON-402] - Update index.html version number
    * [FLAGON-403] - Add updated KEYs
    * [FLAGON-404] - Update Readme.md to reflect version 2.0.0
    * [FLAGON-405] - Add new filter examples to Readme.md
    * [FLAGON-407] - Jenkins Builds Failing at Master
    * [FLAGON-408] - Update webextension files for Userale version number
    * [FLAGON-409] - Update package.json file to indicate that we can now support Node 12.2.0 (engines)
    * [FLAGON-410] - Add setLogMapper API examples to README.md and Website
    * [FLAGON-411] - Update Release Scripts to Package WebExtension
    * [FLAGON-412] - Update Example page to include mapping and filtering examples
    * [FLAGON-413] - Update Changelog for Release Candidate


































