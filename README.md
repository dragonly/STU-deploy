STU-deploy
==========
This project is initially intended to use github webhook for code deploying for Fudanstu(organization)
It's based on nodejs

Usage
=====
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
