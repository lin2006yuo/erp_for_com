<template>
    <div class="nav-tabs" :style="{width:width}">
        <div v-show="viewMode === 'nav'" class="n-header">
            <div class="n-header-box" v-cstyle="headerStyle">
                <draggable :list="navs_get" v-cstyle="boxStyle"
                           class="n-header-box-inner" :style="{'left':leftPx}">
                    <nav-item v-for="(nav, index) in navs"
                              :key="nav.router"
                              :nav="nav"
                              :index="index"
                              v-menu-context="menuContext(nav)"
                              @style-update="style_update"
                              @nav-close="eclose"
                              @nav-click="trigger"
                              @nav-dbclick="dbtrigger">
                    </nav-item>
                </draggable>
                <span  @click="click_open_close"
                       :class="[leftOpen?'close-image':'open-image','open-close']"></span>
                <span class="" @click="move_left"
                   :class="[!isHasNavLeft?'disable-left':'','move-box','moveLeft']"></span>
                <span class="move-box moveRight" @click="move_right"></span>
                <span class='refresh' title="F5快捷键" @click="refresh_page($event)"></span>
            </div>
        </div>
        <div v-show="viewMode === 'nav'" class="n-breadcrumb"></div>
        <div id="n-content" :class="viewMode !== 'nav' ? 'full-view':''" @keyup="keyup">
            <div v-show="viewMode !== 'nav'"
                 class="full-view-close"
                 @click="back_navigation" title="返回导航模式"></div>
            <navs-comp ref="navs-component" :navs="navs"></navs-comp>
        </div>
    </div>
</template>
<style lang="stylus">
    .nav-tabs{
        position: relative;
        .mouse-menu{
            z-index: 9999;
            position: fixed;
            top: 0;
            left: 0;
            width:120px;
            /*height:64px;*/
            border:1px solid #96a4d5;
            background-color: #9fbbd5;
            display: none;
            li{
                height:32px;
                line-height:32px;
                border-bottom:1px solid #869ab3
                text-align: center;
                cursor: pointer;
                &:hover{
                    background-color #6e7e93;
                    color: #FFF;

                }
            }
        }
        .n-header{
            width:100%;
            height:35px;
            line-height:35px;
            position:absolute;
            left:0;
            top:0;
            /*background-color:#A1A1A1;*/
            border-bottom:2px solid #00acac;
            z-index:1005;
            .move-box{
                /*background-color:#ddd;
                display:inline-block;*/
                width:17px;
                height:100%;
                position: absolute;
                background-color:#fff;
                &:hover{
                    background-color:#4DB87D;
                }
                &.moveLeft{
                    background-image:url('../assets/left-default.svg');
                    border-right:1px solid #ccc;
                    background-repeat:no-repeat;
                    background-size:12px;
                    background-position:center;
                    top:0;
                    left:35px;
                    &:hover{
                        background-image:url('../assets/left-hover.svg');
                    }
                }
                &.moveRight{
                    background-image:url('../assets/right-default.svg');
                    background-repeat:no-repeat;
                    background-size:12px;
                    background-position:center;
                    border-left:1px solid #ccc;
                    top:0;
                    right:35px;
                    &:hover{
                        background-image:url('../assets/right-hover.svg');
                    }
                }
                &.disable-left{
                    cursor: not-allowed !important;
                    background-color: #EFF2F7 !important;
                    &:hover{
                        background-image:url('../assets/left-default.svg');
                    }
                }
            }

            .open-close{
                position:absolute;
                top:0;
                left:0;
                width:35px;
                height:35px;
                background-color:#fff;
                &:hover{
                    background-color:#4DB87D;
                }
                &.open-image{
                    background-image:url('../assets/open-header(3).svg');
                    background-position:center center;
                    background-size:16px 16px;
                    background-repeat:no-repeat;
                    &:hover{
                        background-image:url('../assets/open-header.svg');
                    }
                }
                &.close-image{
                    background-image:url('../assets/close-header(1).svg');
                    background-position:center;
                    background-size:16px;
                    background-repeat:no-repeat;
                    &:hover{
                        background-image:url('../assets/close-header.svg');
                    }
                }

            }
            .n-header-box{
                white-space:nowrap;
                user-select: none;
                text-overflow:ellipsis;
                overflow:hidden;
                position:absolute;
                top:0;
                left:0;
                right:0;
                bottom:0;
                .n-header-box-inner{
                    position: absolute;
                    top:0;
                    transition: left .2s ease-in;
                }
            }
            .refresh{
                position:absolute;
                top:0;
                right:0;
                width:35px;
                height:100%;
                background-image:url('../assets/refresh-default.svg');
                background-color:#fff;
                background-size:25px;
                background-position:center;
                background-repeat:no-repeat;
                transition: all ease-in-out .5s;
                &:hover{
                    background-color:#4DB87D;
                    background-image:url('../assets/refresh-hover.svg');
                }
            }
        }
        .n-breadcrumb{
            height:24px;
        }
        #n-content{
            width:100%;
            position:absolute;
            top:35px;
            left:0;
            bottom:0;
            right:0;
            overflow:hidden;
            &.full-view{
                position:fixed;
                top: 0!important;
            }
            .full-view-close{
                position: absolute;
                top:30px;
                right:15px;
                z-index: 9999;
                width:45px;
                height:45px;
                border-radius:100%;
                background-color:#00acac;
                background-image: url('../assets/backNav.svg');
                background-position:center;
                background-size:35px 35px;
                background-repeat:no-repeat;
                &:hover{
                    background-color:#4DB87D;
                }
            }
        }
    }
</style>
<script>

    import {mapActions,mapGetters} from 'vuex';
    import datef from '../filters/modules/time';
    import draggable from '../components/drag-drop';
    import routeContent from '../route-content';
    import navItem from './nav-item.vue';
    import mouseKey from '../lib/mouse-key';
    export default{
        data(){
            return {
                headerStyle:{
                    width:true
                },
                boxStyle:{
                    width:true
                },
                inited:[],
                navStyles:[],
                oldNavs:{},
                mouseMenu:{},
                rightNav:null,
            }
        },
        filters:{
            datef,
        },
        mounted(){
            mouseKey('f5', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.refresh_page();
                return false;
            });
            mouseKey('ctrl+left', (e) =>{
                this.$store.dispatch('menu-nav/nav_go_left');
            });
            mouseKey('ctrl+right', (e) =>{
                this.$store.dispatch('menu-nav/nav_go_right');
            })
        },
        methods:{
            ...mapActions({
                nav_cast:'menu-nav/nav_cast',
                changeViewMode:'ui/changeViewMode',
                nav_closeall:'menu-nav/nav_closeall',
                nav_closeother:'menu-nav/nav_closeother',
                nav_move_left:'menu-nav/nav_move_left',
                nav_move_right:'menu-nav/nav_move_right',
                setFastMenus:'menu-nav/setFastMenus',
                openCloseLeftMenu:'menu-nav/openCloseLeftMenu',
            }),
            refresh_page($event){
                const activePage = this.$refs['navs-component'].childs[this.activeNav.router];
                if(activePage && activePage.componentInstance){
                    const pageOptions = activePage.componentInstance.$options;
                    if(pageOptions.refresh){
                        pageOptions.refresh.call(activePage.componentInstance);
                        if(pageOptions.page && pageOptions.page.multiple){
                            function children_refresh(parent) {
                                parent.$children.forEach(child => {
                                    if(child.$options.refresh){
                                        child.$options.refresh.call(child);
                                    }else{
                                        if(typeof child.init === 'function'){
                                            child.init();
                                        }else{
                                            console.warn('this page not define refresh function,not define init function')
                                        }

                                    }
                                    children_refresh(child);
                                });
                            }
                            children_refresh(activePage.componentInstance)
                        }
                    }
                }
            },
            back_navigation(){
                this.changeViewMode('nav');
                this.openCloseLeftMenu(true);
                this.$emit('click-open-close');
            },
            click_open_close(){
                this.openCloseLeftMenu(!this.leftOpen);
                this.$emit('click-open-close');
            },
            trigger(ind){
                this.nav_cast(ind);
                this.$emit('trigger',this.navs_get[ind].id || 0);
            },
            dbtrigger(ind){
                this.trigger(ind);
                this.changeViewMode();
                this.$emit('dbtrigger');
            },
            eclose(router, index){
                if(this.navs[index] && this.navs[index].rest){
                    this.$close(router);
                    this.trigger(this.navs_index);
                    return;
                }
                if(this.$refs['navs-component']){
                    const vnode = this.$refs['navs-component'].childs[router];
                    if(vnode){
                        if(!vnode.componentInstance){
                            return this.$message({type:'fail',message:'该页面未加载完毕，无法关闭'});
                        }
                        const options = vnode.componentInstance.$options || {};
                        const page = options.page || {};
                        const beforeClose = page.beforeClose;
                        if(beforeClose && beforeClose.constructor.name === 'Function'){
                            const result = beforeClose.call(vnode.componentInstance);
                            if((result instanceof Promise) || ("Promise" === result.constructor.name)){
                                result.then((res)=>{
                                    res&&this.$close(router);
                                    this.trigger(this.navs_index);
                                }).catch(error=>{
                                    this.$message({type:"error",message:error})
                                })
                            }else if(result === true){
                                this.$close(router);
                                this.trigger(this.navs_index);
                            }else if(result && ("String" === result.constructor.name)){
                                this.$message({type:"error",message:result})
                            }else{
                                console.error('close nav beforeClose return error');
                                console.error(result);
                            }
                        }else {
                            this.$close(router);
                            this.trigger(this.navs_index);
                        }
                    }
                }

            },

            menuContext(nav){
                let commons = [
                    {label:"在新窗口打开",action(){
                        this.$openNew(nav.router);
                    }},
                    {label:"关闭所有窗口",action(){
                        this.nav_closeall()
                    }},
                    {label:"关闭其它窗口",action(){
                        this.nav_closeother(nav)
                    }},
                ];
                if(this.fastMenus.find(fast => fast.id === nav.id)){
                    commons.push({
                        label:'取消快捷菜单',
                        action(){
                            let index = this.fastMenus.indexOfFun(n =>{
                                return n.id === nav.id;
                            });
                            this.fastMenus.splice(index, 1);
                            this.setFastMenus(this.fastMenus);
                            this.$forceUpdate();
                        }
                    })
                }else{
                    commons.push({
                        label:'设为快捷菜单',
                        action:() =>{
                            this.fastMenus.push(nav);
                            this.setFastMenus(this.fastMenus);
                            this.$forceUpdate();
                        }
                    })
                }
                return commons;
            },
            move_left(){
                this.isHasNavLeft && this.nav_move_left();
            },
            move_right(){
                this.isHasNavRight && this.nav_move_right();
            },
            style_update(index, styles){
                this.$set(this.navStyles, index, styles);
            },
            keyup(event){
            },
        },
        computed:{
            ...mapGetters({
                viewMode:'ui/viewMode',
                navs_index:'menu-nav/navs_index',
                navs_move:'menu-nav/navs_move',
                menus_all:'menu-nav/menus_all',
                navs_get:'menu-nav/navs_get',
                fastMenus:'menu-nav/fastMenus',
                leftOpen:'menu-nav/leftOpen'
            }),
            activeNav(){
                return this.navs.find(nav =>nav.active)
            },
            navs(){
                let navs = [];
                this.navs_get.forEach((nav,index)=>{
                    try{
                        let navItem = Object.create(null);
                        navItem.id = nav.id;
                        navItem.name = nav.title;
                        navItem.index=index;
                        navItem.active = index === this.navs_index;
                        navItem.rest=nav.rest;
                        navItem.router=nav.paths;
                        navItem.route=nav.route;
                        navItem.param= nav.param;
                        navItem.component = nav.routeMap.component;
                        navs.push(navItem);
                    }catch ($exp){
                        console.log($exp);
                        console.log(this.$refs[`page-${nav.id}`]);
                        console.log(nav.id);
                    }

                });
                return navs;
            },
            isHasMoveNav(){
                const hasOverWidth = parseInt(this.headerStyle.width) <= parseInt(this.boxStyle.width);
                return hasOverWidth || this.navs_move;
            },
            isHasNavLeft(){
                return this.navs_move > 0;
            },
            isHasNavRight(){
                let w = [
                    'border-left-width',
                    'border-right-width',
                    'padding-left',
                    'padding-right',
                    'margin-right',
                    'margin-left',
                    'width'
                ];
                const calc = (n) =>{
                    return w.reduce((s,v)=>{
                        return s + parseInt(n[v])||0
                    },0)
                };
                let sum = 0;
                let headerStyle = parseInt(this.headerStyle.width);
                for(let i = this.navs_move; i < this.navs_get.length; i++){
                    const n = this.navStyles[i];
                    if(n){
                        n.sum = n.sum || calc(n)
                        sum +=n.sum;
                        if(sum > headerStyle){
                            return true;
                        }
                    }
                }
                console.log(`headerStyle:${headerStyle}   sum:${sum}`);
                return false;
            },
            leftPx(){
                let ret = 0;
                for(let i=0; i< this.navs_move; i++){
                    let style = this.navStyles[i];
                    if(style){
                        ret +=parseInt(style['border-left-width']);
                        ret +=parseInt(style['border-right-width']);
                        ret +=parseInt(style['margin-left']);
                        ret +=parseInt(style['margin-right']);
                        ret +=parseInt(style['padding-left']);
                        ret +=parseInt(style['padding-right']);
                        ret +=parseInt(style['width']);
                    }
                }
                return -ret + 'px';
            },
        },
        props:{
            width:{},
        },
        components: {
            routeContent, draggable,navItem,
            navsComp:require('./navs-comp').default
        }
    }
</script>
