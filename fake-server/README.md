# TRex Fake Server

### Setup

* Install NodeJS
* Open terminal (command prompt):
```sh
cd fake-server
npm install
```

## Start

```
cd fake-server
node server.js
```

# npm Scripts

- `npm start`  = `node server.js`
- `npm test` = `gulp mocha` (run test suite once)
- `npm test-watch` = `gulp watch` (live testing mode with active watch)

## Test

To test fake-server:

- Open file `tests\integration-tests.http`
- Press `Send Request` command (**REST Client** extension have to be installed)

# Node JS packages

```
npm init
npm install express multer cors
npm install d3-dsv
install mocha -g
npm install mocha chai --save-dev 
install gulp -g
install gulp gulp-mocha gulp-util --save-dev 
```

gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5