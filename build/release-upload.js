const release = require('./release.js');
release().then( () =>{
    require('./upload')

}).catch(fail =>{
})
