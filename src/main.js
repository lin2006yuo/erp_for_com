// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from 'vue';
import './lib/screen';
import './lib/printer';
import './lib/pinyin-search';
import './lib/date';
import './lib/element';
import './lib/url';
import './lib/resize';
import './config';
import './lib/utils.js';
import './lib/datef';
import './lib/websocket';
import './lib/throttle-debounce'
import './lib/events';
import './lib/log';
import './lib/websockets';

window.buildTime = process.env.buildTime;

import vrouter from './routes_depr/router';

window.$$VUE = Vue;
import './load-global-components';

Vue.component('ui-div', {
    render(createElmement) {
        return createElmement('div', {}, this.$slots.default)
    }
});
import searchCard from './components/search-card';
import pageDialog from './components/page-dialog';
import uiTip from './components/ui-tip';
import uiTable from './components/ui-table';
Vue.component('searchCard',searchCard);
Vue.component('pageDialog',pageDialog);
Vue.component('uiTip',uiTip);
Vue.component('uiTable',uiTable);

Vue.component('draggable', require('vuedraggable'));
Vue.component('page', require('./page.vue').default);
Vue.component('permission', require('./components/permission.vue').default);
Vue.component('ui-form', require('./components/ui-form.vue').default);
Vue.component('input2', require('./components/input.vue').default);
Vue.component('ui-form-item', require('./components/ui-form-item.vue').default);
Vue.component('times', require('./components/times.vue').default);
Vue.component("ui-time-pick", require('./components/ui-time-pick.vue').default);
Vue.component("ui-select", require('./components/ui-select.vue').default);


if (process.env.NODE_ENV === 'release') {
    console.log_bak = console.log;
    console.log = function () {
    };

    console.__err_bak = console.error;
    console.error = function () {
        // console.__err_bak(...arguments, Math.round(Date.now() / 1000));
        let error = sessionStorage.getItem('error:log');
        if (error) {
            error = JSON.parse(error);
        } else {
            error = [];
        }
        error.push(arguments);
        sessionStorage.setItem('error:log', JSON.stringify(error));
    };
    window.printError = function () {
        let error = sessionStorage.getItem('error:log');
        if (error) {
            error = JSON.parse(error);
            error.forEach(err => {
                console.log(...err)
            })
        } else {
            console.log_bak('没有ERROR日志');
        }
    }
}


import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'

Vue.use(VueKindEditor);

import './components/page-link';

import './filters/index';

import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/error-picture-128.png',
    // loading: '/static/loading.gif',
    loading: '/static/loading(3).gif',
    attempt: 1
});

Vue.config.devtools = true;

Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    mediaPlayPause: 179
};

Vue.config.errorHandler = Vue.config.warnHandler = function (err, vm, info) {
    console.log(vm);
    console.log(info);
    console.log(document.addEventListener);
    console.error('errorHandler: ' + err);
};

import App from './App.vue';


const plugins = require.context('./plugin');
plugins.keys().forEach(key => {
    const plugin = plugins(key).default;
    if (!plugin.disabled) {
        Vue.use(plugin)
    }
});


const directives = require.context('./directives');
directives.keys().forEach(key => {
    const directive = directives(key);
    directive.default(Vue);
});

import store from './vuex';

import i18n from './i18n';

window.$$VUE_GLOBAL = new Vue({
    el: '#app',
    router: vrouter,
    store,i18n,
    render: h => h(App)
});
// Hot updates
if (module.hot) {
    module.hot.accept(['@/lang/en', '@/lang/zh'], function () {
        i18n.setLocaleMessage('en', require('@/lang/en/message').default)
        i18n.setLocaleMessage('ja', require('@/lang/zh').default)
        // Or the following hot updates via $i18n property
        // app.$i18n.setLocaleMessage('en', require('./en').default)
        // app.$i18n.setLocaleMessage('ja', require('./ja').default)
    })
}
