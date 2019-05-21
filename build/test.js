const remote = require('scp2');


remote.scp('dist/index.html',{
    host: '172.18.15.11',
    username: 'root',
    password: 'rondaful123',
    path: '/home/test/'
},function(){
    console.log(...arguments);
});