2017-10-10, Version 0.6.5
=========================

 * Removed console.log (Russell Lewis)


2017-10-10, Version 0.6.4
=========================

 * Exchange and Queue not returned when resolving a publish/exchange action (Russell Lewis)


2017-10-10, Version 0.6.3
=========================

 * Fixed early returning promise (Russell Lewis)


2017-10-06, Version 0.6.2
=========================

 * Removed global Promise replace. (Russell Lewis)


2017-10-05, Version 0.6.1
=========================

 * Closed connections in tests so Mocha 4.0 didn't hand when running (Russell Lewis)

 * Updated packages (Russell Lewis)

 * Fixed linting err (Russell Lewis)

 * Delete .DS_Store (Russell Lewis)

 * Removed .DS_Store (Russell Lewis)

 * Fixed readme (Russell Lewis)

 * Fixed tests (Russell Lewis)

 * Updated readme (Russell Lewis)

 * Added RPC example (Russell Lewis)

 * Exchanges and Queues now also act like promises (Russell Lewis)

 * Improved promise flow (Russell Lewis)


2017-10-05, Version 0.6.0
=========================

 * Update README.md (Russell Lewis)

 * Create LICENSE (Russell Lewis)

 * docs(readme): add Greenkeeper badge (greenkeeper[bot])

 * chore(package): update dependencies (greenkeeper[bot])


2017-10-04, Version 0.5.1
=========================

 * Added await to incoming connection incase the promise is not resolved (Russell Lewis)


2017-10-03, Version 0.5.0
=========================

 * Updated packages (Russell Lewis)

 * Added improved connection management (Russell Lewis)


2017-10-03, Version 0.4.14
==========================

 * Close connection when closing channel (Russell Lewis)


2017-10-03, Version 0.4.13
==========================

 * Added 'PRMQ_LOG' env variable to switch logging on for testing (Russell Lewis)

 * Added results object to ex's and q's for storing result from sends (Russell Lewis)

 * Added some tests and fixed ConfirmChannel initialization (Russell Lewis)


2017-09-26, Version 0.4.12
==========================

 * Removed Postinstall package and added @types as prod deps (Russell Lewis)

 * Updated readme (Russell Lewis)

 * Removed redundant imports (Russell Lewis)


2017-09-19, Version 0.4.11
==========================

 * Improved compatability for using the library (Russell Lewis)


2017-09-19, Version 0.4.10
==========================



2017-09-19, Version 0.4.9
=========================

 * we keep trying (Russell Lewis)

 * Added both export types (Russell Lewis)

 * Fixed import on tests (Russell Lewis)

 * Made prmq class exportable (Russell Lewis)

 * Still trying to get this working (Russell Lewis)

 * try to specify types in tsconfig (Russell Lewis)

 * Adding --module commonjs to prod compile (Russell Lewis)

 * Trying to use the tsconfig for building (Russell Lewis)


2017-09-19, Version 0.4.8
=========================

 * Fixed types when doing buildprod (Russell Lewis)


2017-09-19, Version 0.4.7
=========================

 * Trying to fix package (Russell Lewis)


2017-09-19, Version 0.4.6
=========================

 * Made TS compile local to package (Russell Lewis)


2017-09-19, Version 0.4.5
=========================

 * Made TS compile local to package (Russell Lewis)


2017-09-19, Version 0.4.4
=========================

 * Trying to get tsc to not use parent tsconfig (Russell Lewis)


2017-09-19, Version 0.4.3
=========================

 * Removed incorrect JS files (Russell Lewis)

 * Made TS compile local to package (Russell Lewis)


2017-09-19, Version 0.4.2
=========================

 * Removed /dist (Russell Lewis)


2017-09-19, Version 0.4.1
=========================

 * Removed /dist (Russell Lewis)

 * Added postinstall script to build ts (Russell Lewis)

 * Added missing files to dist and fixed packages build (Russell Lewis)

 * Added /dist folder (Russell Lewis)


2017-09-19, Version 0.4.0
=========================

 * Fixed another casing issue (Russell Lewis)

 * Type (Russell Lewis)

 * Change exchange folder name to be lowercase (Russell Lewis)

 * Removed unused imports (Russell Lewis)

 * Connection is only established when performing an action on a channel (Russell Lewis)

 * ConfirmChannel (Russell Lewis)

 * Moved test running over to ts-node (Russell Lewis)

 * Update README.md (Russell Lewis)

 * Added debug message on disconnect error (Russell Lewis)

 * Added reconnect logic on channels when an error happens (Russell Lewis)

 * Fixed assertion in test (Russell Lewis)

 * Fixed bad test assertions (Russell Lewis)

 * Fixed a couple more linting issues (Russell Lewis)

 * Updated TS files to pass tslint-microsoft-contrib rules (Russell Lewis)

 * Removed babel from travis (Russell Lewis)

 * Moved code over to Typescript (Russell Lewis)


2017-09-14, Version 0.3.6
=========================

 * Fixed package.json (Russell Lewis)


2017-09-14, Version 0.3.5
=========================

 * Trying to fix postinstall babel transpile (Russell Lewis)


2017-09-14, Version 0.3.4
=========================



2017-09-14, Version 0.3.3
=========================

 * Added babel-cli to packages (Russell Lewis)


2017-09-14, Version 0.3.2
=========================

 * Moved babed to postinstall script (Russell Lewis)


2017-09-14, Version 0.3.1
=========================

 * Added install phase to package.json (Russell Lewis)

 * Added channel.checkQueue() (Russell Lewis)

 * Added channel.close() method (Russell Lewis)


2017-09-12, Version 0.3.0
=========================

 * Updated README.md (Russell Lewis)

 * Removed tests (Russell Lewis)

 * Added more base channel() tests (Russell Lewis)

 * Refined the API. Started working on more tests (Russell Lewis)

 * Removed some helper methods to allow for sensible options (Russell Lewis)


2017-09-12, Version 0.2.4
=========================

 * Added codecov to README.md (Russell Lewis)

 * Added istambul for codecov (Russell Lewis)

 * Added codecov (Russell Lewis)

 * Update README.md (Russell Lewis)

 * Added Travis Status Badge (Russell Lewis)

 * Updated babel to compile to current node version (Russell Lewis)

 * Added RMQ to travis build (Russell Lewis)

 * Added travis file (Russell Lewis)


2017-09-12, Version 0.2.3
=========================

 * remove files (Russell Lewis)

 * Removed files (Russell Lewis)

 * Removed .idea (Russell Lewis)


2017-09-11, Version 0.2.2
=========================

 * Node v6.x support (Russell Lewis)

 * Added Node 6.x support (Russell Lewis)


2017-09-11, Version 0.2.1
=========================

 * Fixed small bug. README.md (Russell Lewis)

 * Made the library ES5 compatible (Russell Lewis)


2017-09-11, Version 0.2.0
=========================

 * Updated README.md (Russell Lewis)

 * Added support for topic exchanges (Russell Lewis)

 * Update README.md (Russell Lewis)


2017-09-10, Version 0.1.0
=========================

 * Updated README (Russell Lewis)

 * Updated API to be more fluent and async compatible (Russell Lewis)

 * More tests (Russell Lewis)

 * dunno (Russell Lewis)

 * Update README.md (Russell Lewis)


2017-09-07, Version 0.0.5
=========================

 * Updated .gitingore (Russell Lewis)

 * Updated readme.md (Russell Lewis)

 * Improved API (Russell Lewis)

 * Further library improvements (Russell Lewis)

 * Reworked to allow for promise flow when working with exchanges and queues (Russell Lewis)

 * Renamed method in example (Russell Lewis)


2017-09-06, Version 0.0.4
=========================

 * Added exchange delete method and updated test (Russell Lewis)


2017-09-06, Version 0.0.3
=========================

 * Updated readme to include require (Russell Lewis)

 * erge branch 'master' of https://github.com/Russe11/prmq (Russell Lewis)

 * Updated readme (Russell Lewis)


2017-09-06, Version 0.0.2
=========================

 * First release!
