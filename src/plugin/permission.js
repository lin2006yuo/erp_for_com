/**
 * Created by wuchuguang on 17-6-30.
 */
import {mapActions,mapGetters}  from 'vuex';
export default {
    install(Vue){
        Vue.mixin({
            data(){
                return {
                    apis:{}
                }
            },
            created(){
                if(this.$options.permission){
                    Object.keys(this.$options.permission).forEach(key=>{
                        this.$set(this.apis, key, this.$options.permission[key]);
                    });
                }
            },
            methods:{
                ...mapActions({
                        $addPermission:'permission/addPermission',
                        $delPermission:'permission/delPermission'
                }),
                $hasPermission(url){
                    return this.$store.getters['permission/hasPermission'](url);
                },
            },
            computed:{
            }
        })
    }
};