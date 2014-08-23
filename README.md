STU-deploy
==========
This project is initially intended to use github webhook for code deploying for Fudanstu(organization)

It's based on nodejs

Usage
=====
put this folder in `node_modules` in your node project's directory, and use it as follows
```js```
var deploy = require('STU-deploy').factory();
deploy.configure({
    route: {
        'STU-Fudan/testDeploy': /path/to/files,
        ...
    },
    port: 2333
})
.run();
```
