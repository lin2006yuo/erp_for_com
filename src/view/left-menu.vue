<template>
    <nav-menu :menus="menus_get"
              :router="router"
              :select="select"
              :fast-active.sync="fastActive"
              @menu-search="menuSearch"
              :open="open"
              :close="close"
              >
    </nav-menu>
</template>
<style lang="stylus" scoped>
    .is-active{
        color: aliceblue;
        background-color: cornflowerblue;
    }
</style>
<script>

    import {mapGetters,mapActions} from 'vuex';
    export default{
        name: 'left-menu',
        data(){
            return {
                fastActive:false,
                router:''
            }
        },
        props:{
            width:{}
        },
        methods:{
            menuSearch(){
                this.$emit('menu-search')
            },
            select(menuid){
                function find_node(items, id) {
                    if(!items)return undefined;
                    return items.findRet(row =>{
                        if(parseInt(row.id) === id){
                            return row;
                        }else{
                            return find_node(row.children, id);
                        }
                    });
                }
                let node = find_node(this.menus_all, parseInt(menuid));
                console.log(node,'node');
                this.$open(node);
                this.router = node.id + '';
            },
            goswitcher(id){
                this.$nextTick(() =>{
                    this.router = id +'';
                });
            },
            open(){},
            close(){
            },
        },
        computed:{
            ...mapGetters({
                'menus_get':'menu-nav/menus_get',
                'menus_all':'menu-nav/menus_all',
            })
        },
        components: {
            navMenu:require('./nav-menu').default
        }
    }
</script>

