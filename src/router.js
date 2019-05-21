import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter);


let router = new VueRouter({
    routes:require('./routes/routes').default,
    mode: 'history',
});

export default router;
