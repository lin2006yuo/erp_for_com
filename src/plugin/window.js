export default {
    install(Vue, options = {}){
        Vue.prototype.$connectTab = function(win, type = 'create', message = {}){
            return new Promise((resolve, reject)=>{
                switch (type) {
                    case 'create':
                        let windID = this.$openNew('/new-window');
                        windID.onload = function () {
                            windID.postMessage(message);
                            resolve(windID);
                        };
                        console.log(windID);
                        break;
                    case 'connect':
                        console.log(win,'win');
                        win.postMessage(message);
                        resolve();
                        break;
                    default:
                        reject(new Error('Parameter "type" error. Parameter can only be:"create" or "connect"'));
                }
            });

        }
    }
}
