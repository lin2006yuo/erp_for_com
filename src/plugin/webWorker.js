export default {
    install(Vue, options){
        Vue.__webWorker = {
            __next:0,
            next(){
                this.__next +=1;
                return this.__next;
            },
            callbacks:{},
            installedWorkers:{}
        };
        function tryInstallWorker(worker){
            if(Vue.__webWorker.installedWorkers[worker]){
                return Vue.__webWorker.installedWorkers[worker];
            }
            Vue.__webWorker.installedWorkers[worker]= new Worker(`/static/worker-${worker}.js`);
            Vue.__webWorker.installedWorkers[worker].onmessage = (message) =>{
                let {next,result, status} = JSON.parse(message);
                let {succ, fail} = Vue.__webWorker.callbacks[next];
                if(status){
                    succ(result);
                }else{
                    fail(result);
                }
                delete Vue.__webWorker.callbacks[next];
            }
            return tryInstallWorker(worker);
        }

        Vue.mixin({
            beforeCreate(){
                this.$workerSend = (cmd, params, worker) =>{
                    let webWorker = tryInstallWorker(worker);
                    return new Promise((succ, fail) =>{
                        let next = Vue.__webWorker.next();
                        Vue.__webWorker.callbacks[next] = {succ, fail}
                        webWorker.postMessage(JSON.stringify({btime:Date.now(),next,cmd,params}));
                    })
                }

                this.$workerClose = (worker) =>{
                    if(Vue.__webWorker.installedWorkers[worker]){
                        const workerInstrance = Vue.__webWorker.installedWorkers[worker];
                        workerInstrance.terminate();
                        delete Vue.__webWorker.installedWorkers[worker];
                    }
                }
            }
        })
    }
}
