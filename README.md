
# ShortURL

**Node.js Tiny URL generator with analytics**

***Based on https://github.com/edwardhotchkiss/short/***
***Modified over https://github.com/thinkroth/shortUrl*** 

Now with a simple front-end with using twitter bootstrap!

### Push to Stackato

```bash
$ stackato push -n
```

### Local Setup

note: requires MongoDB on localhost

```bash
$ npm install
$ node app.js
```

### Basic API Usage

Just add the long URL to the end of localhost:8080/api to shorten it

```bash
$ curl localhost:8080/api/http://www.activestate.com/stackato
https://localhost:8080/LwR6y7x
```
