export default {
    install(Vue){
        Vue.mixin({
            beforeCreate(){
                this.loadSuperSelect = (stroageKey, options, opt = {force:false, pageSize:20}) =>{
                    this.$store.dispatch('storage/storageInit',{
                        key: stroageKey,
                        data: data2page(options, pageSize),
                        count: options.length,
                        forceCovered: force
                    })
                }
            }
        });
    }
}
