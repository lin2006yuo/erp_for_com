<template>
    <!--<div id="app" @keydown.116.prevent="keyright" @keyup.ctrl.70.prevent="searchBox">-->
    <div id="app">
        <router-view></router-view>
        <find-view :query="$store.getters['find-view/query']"
                   @find="$store.getters['find-view/find']"
                   :value="$store.getters['find-view/show']"
                   @input="$store.dispatch('find-view/show',$event)"
        ></find-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Element from 'element-ui';
    import VueI18n from 'vue-i18n';
    import zhLocale from "element-ui/lib/locale/lang/zh-CN";
    import enLocale from "element-ui/lib/locale/lang/en";
    import '@/../theme/index.css';
    import '@/scss/global.styl';
    import '@/scss/el-pack.styl';

    Vue.use(VueI18n);

    let lang = sessionStorage.getItem('lang');

    export const i18n = new VueI18n({
        locale: lang||'zh',
        messages:{
            'zh':zhLocale,
            'en':enLocale
        },
    });

    Vue.use(Element, {
        i18n: (key,value) => i18n.t(key,value)
    });

    export default {
        created(){
        },
        mounted() {
        },
    }
</script>

<style lang="stylus">
    @import './scss/var.styl';
    html, body, #app {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        position: relative;
        min-width: $site-width;
    }

    #app {
        .header {
            width: 100%;
            height: 60px;
        }
        .left-menu {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
        }
        .nav-tabs {
            /*background-color:rgba(176,206,134,.5) ;*/
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            overflow: hidden;
        }
        .footer {
            height: 30px;
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            overflow: hidden;
            line-height: 30px;
            background-color: #324057;
        }

    }
</style>
