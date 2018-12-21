<template>
    <el-row>
        <menu-list ref="menu"></menu-list>
    </el-row>
</template>
<style lang="stylus">
    .header {
        background-color: #324057;
    }

</style>
<script>
    import menuList from '../components/menu-list.vue';
    import {api_menus, api_permission} from '../api/user';
    import {make_auth} from '../auth';
    import {mapActions, mapGetters} from 'vuex';
    export default{
        data(){
            return {}
        },
        created(){
            this.re_make_auth();
        },
        mounted(){
        },
        methods: {
            ...mapActions({
                menuload: 'menu-nav/load',
                switcher: 'menu-nav/switcher',
            }),
            goswitcher(){//Router.vue调用的
                this.$refs.menu.$refs.menuHeader.goswitcher(...arguments);
            },
            re_make_auth(){
                make_auth().then(() => {
                    this.$http(api_menus).then(list => {
                        this.menuload(list);
                    }).catch(code => {
                        setTimeout(this.re_make_auth, 3000);
                    });
                    this.$http(api_permission).then(permission => {
                        this.load(permission);
                    })
                });
            },
            ...mapActions({load: 'permission/load'})
        },
        computed: {
            ...mapGetters(
                {
                    menus_index: 'menu-nav/menus_index',
                    menus_all: 'menu-nav/menus_all',
                }
            ),
        },
        components: {
            menuList
        }
    }
</script>
