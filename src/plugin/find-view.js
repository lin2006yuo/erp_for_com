export default {
    install(Vue){
        Vue.mixin({
            beforeCreate(){
                this.$findView = (options) =>{
                    this.$store.dispatch('find-view/show',true);
                    this.$store.dispatch('find-view/query',options.query);
                    this.$store.dispatch('find-view/find',options.find);
                }
            }
        });
    }
}