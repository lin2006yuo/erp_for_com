/**
 * Created by RondaFul on 2016/10/18.
 */
import Vue from 'vue';
const modules = require.context('./modules', false);
modules.keys().forEach(key=>{
    const module = modules(key);
    module.default(Vue)
});

