/**
 * Created by wcg on 16-10-14.
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const modules = require.context('./modules', false, /([\w]+)\.js/);
const storeModules = {};
modules.keys().forEach(key => {
    const name = /([\w-]+)\.js$/i.exec(key);
    storeModules[name[1]] = modules(key).default;
});
const store = new Vuex.Store({
    modules: storeModules
});

export default store;
