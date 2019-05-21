<template>
    <ul class="main-menu">
        <template v-for="(menu,index) in headerMenus">
            <el-popover placement='bottom'
                        ref="popover4"
                        :class="[menus_index === menu.id?'menu-active':'','menu']"
                        :width="comWidth"
                        v-if="!leftOpen"
                        :trigger="triggerMenu">
                <div>
                    <vertical-menu-1 :menu-data="curHeaderTip"
                                     @open-router="open_router(index)"></vertical-menu-1>
                </div>
                <span slot="reference">
                     <li :key="menu.id"
                          @mouseover.stop="mouseover_goswitcher(menu.id)"
                          @click="goswitcher_transverse(menu.id)">{{menu.title}}</li>
                </span>
            </el-popover>
            <li class="menu"
                v-else
                :key="menu.id"
                :class="{'menu-active':menus_index === menu.id}"
                @click="goswitcher(menu.id)">{{menu.title}}</li>
        </template>
    </ul>
</template>
<style lang="stylus">
    .main-menu {
        flex: 4;
        display: flex !important;
        justify-content: flex-start;
        align-content: center;
        overflow: hidden;
        span{
            display:inline-block;
            font-size: 1.5rem;
        }
        .menu {
            flex: 1;
            box-sizing: border-box;
            justify-content: center;
            align-content: center;
            cursor: pointer;
            color: #fff;
            /*color: #000;*/
            line-height: 60px;
            text-align: center;
            font-size: 1.5rem;
            max-width: 100px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border-top:2px solid transparent;
            transition:all .3s;
            &:hover {
                border-top:2px solid #009F95;
                /*color:#009F95;*/
                background-color:#000;
            }
        }
    }
    @media screen and (max-width: 1366px) {
        .main-menu {
            flex: 4 !important;
        }
    }
</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    export default {
        data() {
            return {
                pid:"",
            }
        },
        methods:{
            ...mapActions({
                switcher: 'menu-nav/switcher',
            }),
            /**点击跳转路由已在 vertical-menu-1 组件内实现
             * 此方法为点击跳转路由时关闭
             * */
            open_router(index){
                this.$refs.popover4[index].showPopper = false;
            },
            mouseover_goswitcher(id){
                if(this.triggerMenu==='click')return;
                this.pid = id;
                this.switcher(id);
            },
            goswitcher_transverse(id){
                if(this.triggerMenu==='hover')return;
                this.pid = id;
                this.switcher(id);
            },
            goswitcher(id) {
                this.switcher(id);
            },
        },
        computed:{
            ...mapGetters({
                'headerMenus': 'menu-nav/headerMenus',
                'headerTaps': 'menu-nav/headerTaps',
                'menus_index': 'menu-nav/menus_index',
                'leftOpen':'menu-nav/leftOpen',
                'triggerMenu':'menu-nav/triggerMenu',
            }),
            curHeaderTip(){
                let find = this.headerTaps.find(rowlist=>{
                    return rowlist.find(row=>row.pid===this.pid);
                });
                if(find){
                    find = find.filter(row=>row.status&&row.children&&row.children.length>0).map(row=>{
                        row.children=row.children.filter(res=>res.type!==2)
                        return row;
                    });
                }
                return !!find?find:[];
            },
            comWidth(){
                const WIDTH = 12*140;
                let dynamicWidth = this.curHeaderTip.length*140;
                return dynamicWidth>WIDTH?WIDTH:dynamicWidth;
            },
        },
        components: {
            verticalMenu1:require('./vertical-menu-1.vue').default,
        }
    }
</script>