<template>
    <page-dialog :top="20" :inner-style="styles" v-model="show" nottitle title="搜索菜单">
        <ui-autocomplete
                size="large"
                ref="autocomplete"
                style="width: 100%;"
                popper-class="my-autocomplete"
                v-model="menuKey"
                :fetch-suggestions="querySearch"
                custom-item="menu-result"
                placeholder="请输入菜单..."
                @select="select"
                icon="search"
        ></ui-autocomplete>
    </page-dialog>
</template>
<style lang="stylus">
    .my-autocomplete{
        li{
            line-height: normal;
            padding: 7px;
            border-bottom:1px solid #d0ccb7;
            margin-left:10px;
            margin-right:10px;
            .title {
                text-overflow: ellipsis;
                overflow: hidden;
                font-size:15px;
            }
            .url {
                font-size: 12px;
                color: #929292;
                float: right;
            }

            .parent{
                color: #6699FF;
                float: right;
                clear: both;
            }

            .highlighted .url {
                color: #ddd;
            }
        }
    }
</style>
<script>

    import {mapGetters} from 'vuex';
    import Vue from 'vue';
    Vue.component('menu-result',{
        functional: true,
        render: function (h, ctx) {
            let item = ctx.props.item;
            return h('li', ctx.data, [
                h('span', { attrs: { class: 'title' } }, [item.value]),
                h('span', { attrs: { class: 'url' } }, [item.paths]),
                h('div', { attrs: { class: 'parent' } }, [item.parent])
            ]);
        },
        props: {
            item: { type: Object, required: true }
        }

    });
    export default{
        data(){
            return{
                show:this.value,
                menuKey:'',
                selectLine:-1,
                styles:{
                    borderRadius:"5px"
                }
            }
        },
        methods:{
            querySearch(menuKey, cb){
                let ret = [];
                const childs = (menus) =>{
                    menus.forEach(menu=>{
                        if(menu.paths){
                            if(menu.value.indexOf(this.menuKey) >=0){
                                return ret.push(menu)
                            }
                            if(menu.paths.indexOf(this.menuKey) >=0){
                                return ret.push(menu)
                            }
                        }
                    });
                };
                childs(this.menus_all2);
                cb(ret);
            },
            select(menu){
                this.$open(menu.paths);
            },
        },
        computed:{
            ...mapGetters({menus_all:'menu-nav/menus_all'}),
            menus_all2(){
                const getParent = (menu) =>{
                    if(menu.pid > 0){
                        return this.menus_all.find(r => r.id === menu.pid)
                    }else{
                        return false;
                    }
                };
                const parent = (menu, titles = []) =>{
                    let p = null;
                    if(p = getParent(menu)){
                        titles.push(p.title);
                        return parent(p, titles);
                    }else{
                        return titles.join('>');
                    }
                };
                return this.menus_all.map(row =>{
                    return {
                        value:row.title,
                        paths:row.paths,
                        parent:parent(row)
                    };
                });
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(val){
                    this.timer = setTimeout(() =>{
                        this.$refs.autocomplete.$refs.input.$refs.input.focus()
                    },1000)
                }else{
                    clearTimeout(this.timer);
                }
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog:require('../components/page-dialog.vue').default,
            uiAutocomplete:require('../components/ui-autocomplete.vue').default,
        }
    }
</script>