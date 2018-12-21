/**
 * Created by wcg on 16-10-9.
 */
import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import routes from './routes';


let router = new VueRouter({
    routes,
    mode: 'history',
});

export default router;