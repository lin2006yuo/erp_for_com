const remote = require('scp2');

const uploadServices = [
    {
        name:'zrzsoft',
        host: 'www.zrzsoft.com',
        port:1720,
        username: 'root',
        password: 'R21000332+rwuchuwei!',
        path: '/home/erp-web'
    },
    {
        name:'warehouse',
        host: '172.20.0.100',
        username: 'root',
        password: 'rondaful',
        path: '/srv/rsync/vue-deskop/dist2'
    },
    {
        name:'other',
        host: '172.18.8.10',
        username: 'root',
        password: 'rondaful',
        path: '/srv/rsync/vue-deskop/vue-deskop/dist2'
    },
    {
        name:'warehouse',
        host: '172.20.0.154',
        username: 'root',
        password: 'rondaful',
        path: '/srv/rsync/vue-deskop/vue-deskop/dist2'
    },
    {
        name:'other',
        host:'172.20.0.167',
        username:'root',
        password:'rondaful',
        path:'/srv/rsync/vue-deskop/vue-deskop/dist2'
    }
];

function uploadService(config){
    return new Promise((succ, fail) => {
        console.log(config);
        remote.scp('dist/static/', {
            host: config.host,
            port: config.port || 22,
            username: config.username,
            password: config.password,
            path: `${config.path}/static/`
        }, function (err) {
            if(err){
                console.error(err);
                return fail(err)
            }
            remote.scp('dist/index.html',{
                host: config.host,
                port: config.port || 22,
                username: config.username,
                password: config.password,
                path: config.path
            },function(err){
                if(err){
                    console.error(err);
                    return fail(err)
                }
                succ(`remote upload ${config.name} finish...`);
            })
        });
    });
}

const upload = () =>{
    if(uploadServices.length > 0){
        const config = uploadServices.shift();
        wait = true;
        uploadService(config).then(succ =>{
            console.log(succ)
            upload();
        }).catch(fail =>{
            console.error(fail);
            upload();
        })
    }else{
        console.log(`upload finish...`)
    }
};
upload();