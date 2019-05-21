export default {
    install(Vue){
        Vue.mixin({
            created(){
                this.$brower = {};
                Object.defineProperties(this.$brower,{
                    width:{
                        get(){
                            const style = window.getComputedStyle(document.getElementById('n-content'));
                            return parseInt(style.width);
                        }
                    },
                    height:{
                        get(){
                            const style = window.getComputedStyle(document.getElementById('n-content'));
                            return parseInt(style.height);
                        }
                    }
                });
            }
        })
    }
};