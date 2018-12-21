/**
 * Created by wcg on 16-10-10.
 */

import {quit} from '../auth';
export default {
    baseurl:'',
    install(Vue, Options = {}){
        this.baseurl = Options.baseurl || config.apiHost;
        Vue.mixin({
            beforeCreate(){
                this.loadClose = () =>{
                    console.log(`loadClose`)
                };

                this.loadOpen = () =>{
                    console.log(`loadOpen`)
                };

                this.$reqKey = (key, val) =>{
                    if(val === undefined){
                        return this.$store.getters['request-api-state/getReqKey'](key);
                    }else{
                        this.$store.dispatch('request-api-state/setReqKey', {key, val});
                    }
                };
                this.$http = (api, ...datas) =>{
                    let call = null;
                    switch (typeof api){
                        case 'function':
                            call= api.call(this,...datas);
                            break;
                        case 'object':
                            call = api;
                            break;
                        default:
                            console.error(api);
                    }
                    if(!call){
                        console.error(api);
                    }
                    call.__loadings = [];
                    call.loading = function(elOrComp){
                        console.log(elOrComp);
                        if(typeof elOrComp === 'string'){
                            let element = [];
                            switch (elOrComp.charAt(0)) {
                                case '#':
                                    const id = elOrComp.substr(1,elOrComp.length);
                                    element = [document.getElementById(id)];
                                    break;
                                case '.':
                                    const clss = elOrComp.substr(1,elOrComp.length);
                                    element = document.body.getElementsByClassName(clss);
                                    break;
                                default:
                                    console.error(`errorrrrrrrrrrrrrr:${elOrComp}`);
                                    break;
                            }
                            call.__loadings = element;
                        }
                        if(elOrComp instanceof Vue.constructor){
                            call.__loadings = [elOrComp];
                        }
                        console.log(call.__loadings);
                        call.__loadings.forEach(load =>{
                            if(load && load.loadOpen){
                                load.loadOpen();
                            }
                        })
                    };
                    call.finally(function(){
                        call.__loadings.forEach(load =>{
                            if(load && load.loadClose){
                                load.loadClose();
                            }
                        });
                        delete call.__loadings;
                    });
                    call.catch((code, status)=>{
                        if(401 === status || code.message === 'Error: Token is not valid'){//登录码已失效了.
                            this.$router.replace('/login');
                            quit();
                            code.message = "请登录";
                            return Promise.reject(code);
                        }else{
                            return Promise.reject(code);
                        }
                    });
                    return call;
                };
            },

        })
    }
};
