export default {
    install(Vue, options){
        Vue.mixin({
            beforeCreate(){
                this.$openDialog = (name, props = {}, events = {}) =>{

                }
            }
        })
    }
}
