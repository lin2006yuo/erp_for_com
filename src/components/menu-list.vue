<template>
    <div class="c-menu-list" :style="menuStyle">
        <div class="img-box">
            <img  class="logo" src="../assets/logo-4.png">
        </div>
        <!--横向头部菜单-->
        <main-menu-header ref="menuHeader"></main-menu-header>
        <div class="userHandle">
            <div class="searchall">
                <div class="inline search-result">
                    <i class="icon-search" @click="search"></i>
                    <input v-model="conndValue"
                           ref="conndValue"
                           style="width:100%;"
                           class="el-input__inner inline"
                           @keyup.enter="search">
                </div>
                <el-cascader
                        class="inline s-width-default"
                        v-model="conndList"
                        change-on-select
                        expand-trigger="hover"
                        @change="change_cascader"
                        :options="connds"
                ></el-cascader>
            </div>
            <div class="user-message ml-sm"
                 v-if="curClientWidth>1600"
                 :title="get_name" v-copy
                 @click="click_user_mes">
                你好【{{getUserInfo.realname}}】编号：{{getUserInfo.username}}
            </div>
            <el-popover
                    placement="bottom"
                    width="80"
                    trigger="hover">
                <hide-handle @click-pwd="passwordDialog = true"
                             @set-up="setUpDialog = true"
                             @click-version="showVersion=true"></hide-handle>
                <span slot="reference">
                    <div class="head-portrait-box">
                        <el-badge v-if='messageCount' :value="messageCount" class="item">
                            <img src="../assets/cat.svg" alt="" class="head-portrait">
                        </el-badge>
                            <img src="../assets/cat.svg" class="head-portrait" v-else>
                    </div>
                </span>
            </el-popover>
            <div class="inline">
                <el-checkbox v-model="checkEnglish"
                             @change.native="change_English"
                             style="color:white">English</el-checkbox>
            </div>
        </div>
        <change-password v-model="passwordDialog"
                         :username="getUserInfo.username"></change-password>
        <version-info v-model="showVersion"></version-info>
        <set-up v-model="setUpDialog"></set-up>

    </div>
</template>
<style lang="stylus" scoped>
    .search-result{
        position :relative;
        width :37%;
        .el-input-group__append{
            background-color :#fff;
        }
        .icon-search{
            background: url(../assets/homepage-search-do.png) no-repeat;
            background-size:70% 70%;
            background-color: white;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 0px;
            margin:6px 5px 0 5px;
            right: 0;
        }
    }
    .c-menu-list {
        display: flex;
        background-color: #2D353C;
        font-size: 1.1rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        height: 100%;
        .img-box {
            display: inline-block;
            height: 60px;
            width: 180px;
            overflow: hidden;
            box-sizing: border-box;
            position: relative;
            .logo {
                /*height: 37px;*/
                height: 50px;
                position: absolute;
                top: 44%;
                left: 46%;
                transform: translate(-50%, -50%);
            }
        }
        .client {
            margin-top: 1px;
            height: 26px;
            width: 100%;
            .icons {
                margin-top 5px
            }
            .person {
                height: 100%;
                font-size: 1.2rem;
                line-height: 26px;
                float: left;
            }
            img {
                height: 16px;
                width: 16px;
                position: relative;
                top: 3px;
                right: 2px;
            }
            .personcenter {
                width: 120px;
                height: 100%;
            }
            .handles-box {
                list-style: none;
            }
            .el-button.el-button--primary {
                padding: 2px 6px;
                line-height: 18px;
            }

        }
        .searchall {
            display: inline;
            .el-input-group{
                width:68%;
            }
            .el-input__inner{
                width:37%;
            }
        }
        button, input, select {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 1.2rem;
        }
        select {
            background-color: buttonface;
            border-radius: 0;
            border: 1px solid rgb(169, 169, 169);
            text-shadow: none;
        }
        button.search {
            border: 1px solid #008BCE;
            background-color: #008BCE;
            color: #fff;
            &:hover {
                background-color: #fff;
                color: #008BCE;
                border: 1px solid #fff;
            }
        }
        input {
            border: 1px solid #ddd;
        }
        .userHandle {
            flex: 2.2;
            color: #fff;
            margin: 0 10px 0 20px;
            padding-top:10px;
            overflow:hidden;
            .head-portrait-box{
                display: inline-block;
                vertical-align: middle;
                .head-portrait{
                    width:40px;
                    height:40px;
                    border-radius:100%;
                }
            }
            .user-message{
                display:inline-block;
                width:100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align:middle;
            }
        }
        .el-tree-node {
            &.is-current .el-tree-node__content {
                background-color: #00a0e9;
            }
        }

    }
    @media screen and (max-width: 1600px) {
        .c-menu-list{
            flex: 4 !important;
        }
    }
</style>
<script>

    import {mapActions, mapGetters} from 'vuex';
    import TreePanel from "@/components/tree-panel";

    export default {
        data() {
            return {
                input4:'',
                pid:'',
                passwordDialog: false,
                showVersion: false,
                setUpDialog:false,
                handle: 'personal_center',
                switchHandle: 0,
                checkEnglish:false,
                lang:'',
                connds: [
                    {
                        label: '订单', value: 'order', children: [
                            {label: '订单号', value: 'order_num'},
                            {label: '平台订单号', value: "channel_order_number"},
                            {label: '买家ID', value: 'buyer_id'},
                            {label: '交易号', value: 'transaction_id'},
                            {label: 'ItemID', value: 'item_id'},
                            {label: '目的地', value: 'target'},
                            {label: '追踪号', value: 'tracking'},
                            {label: 'SKU', value: "order_sku"},
                            {label: '邮箱', value: "email"},
                            {label: '付款交易号', value: "pay"},
                            {label: '包裹号', value: "number"},
                            {label: '物流商服务单号', value: "process_code"},
                            {label: '邮编', value: 'zip_code'},
                            {label: '买家姓', value:  'buyer'},
                            {label: '买家姓名', value: 'buyer_name'}
                        ]
                    },
                    {
                        label: '产品', value: "product", children: [
                            {label: "SKU", value: "product.sku"},
                            {label: '产品名称', value: "product.name"},
                            {label: '中文报关名', value: "product.declareName"},
                            {label: '英文报关名', value: "product.declareEnName"},
                            {label: '中文配货名', value: "product.packingName"},
                            {label: '英文配货名', value: "product.packingEnName"},
                        ]
                    },
                ],
                conndSelect:[],
                connd: "order.order_num",
                conndList:['order'],
                conndValue: '',
                color: '#fff',
                showTree: false,
                placement: 'bottom-start',
                curClientWidth:1920,
                messageCount:0,
            }
        },
        mounted() {
            this.curClientWidth = document.body.clientWidth;
            this.get_number();
            this.timer3 = setInterval(this.get_number,3000);
            this.get_lang();
        },
        destroyed(){
            clearInterval(this.timer3);
        },
        methods: {
            ...mapActions({
                switcher: 'menu-nav/switcher',
                nav_closeall: 'menu-nav/nav_closeall',
            }),
            change_English(val){
                let lang = this.checkEnglish?'en':'zh';
                loadLanguageAsync(lang);
                sessionStorage.setItem('lang',lang);
            },
            get_lang(){
                let lang = sessionStorage.getItem('lang');
                if(lang==='en')this.checkEnglish = true;
            },
            get_number(){
                this.messageCount = sessionStorage.getItem('messageCount');
            },
            click_user_mes(){ },
            change_cascader(val){
                if(this.conndValue===''){
                    this.$refs.conndValue.focus();
                }else{
                    this.search();
                }
            },
            handleClick(item) {
                item.action.call(this);
            },
            search() {
                let param = {key: this.searchKey, value: this.conndValue};
                switch (this.searchGroup) {
                    case 'order':
                        this.$open('/order/local/search', param);
                        break;
                    case 'product':
                        this.$open('/goods', param);
                        break;
                    default:
                        console.log(`not find search group ${this.searchGroup}`);
                }
            }
        },
        computed: {
            ...mapGetters({
                'headerMenus': 'menu-nav/headerMenus',
                'headerTaps': 'menu-nav/headerTaps',
                'menus_index': 'menu-nav/menus_index',
                'menus_get':'menu-nav/menus_get',
                'getUserInfo': 'user/info',
                'leftOpen':'menu-nav/leftOpen',
                'triggerMenu':'menu-nav/triggerMenu',
            }),
            curWidth(){
                return document.body.clientWidth
            },
            currentOperate() {
                return this.handles[this.switchHandle].label;
            },
            searchGroup() {
                return this.conndList[0];
            },
            get_name(){
                return  `你好【${this.getUserInfo.realname}】编号：${this.getUserInfo.username}`
            },
            searchKey() {
                return this.conndList[1] || this.searchGroup;
            },
            menuStyle() {
                if (url('hostname') === '172.18.15.11') {
                    return {
                        backgroundColor: '#931e1e'
                    }
                } else {
                    return {};
                }
            },
            selectBody(){
                const calc = function (childrens, selects, nodes = []) {
                    let index = selects.shift();
                    if (index !== undefined) {
                        let children = childrens[index];
                        if (children) {
                            nodes.push(children);
                            calc(children.childrens, selects, nodes)
                        }
                    }
                    return nodes;
                };
                return calc(this.connds, this.conndSelect.concat()).map(node =>{
                    return node.label;
                }).join('>') || "搜索范围..."
            },
        },
        components: {
            TreePanel,
            iconHelp: require('./icon-help.vue').default,
            iconQuit: require('./icon-quit.vue').default,
            iconPassword: require('./icon-password.vue').default,
            iconPersonal: require('./icon-personal.vue').default,
            iconVersion: require('./icon-version.vue').default,
            iconPrinter: require('./icon-printer.vue').default,
            iconMessage: require('./icon-message.vue').default,
            versionInfo: require('../view/base/release/version-info.vue').default,
            changePassword: require('./change-password.vue').default,
            treePanel: require('@/components/tree-panel').default,
            uiTip:require('./ui-tip.vue').default,
            hideHandle:require('./hide-handle.vue').default,
            mainMenuHeader:require('./main-menu-header.vue').default,
            setUp:require('./set-up').default,
        }
    }
</script>

