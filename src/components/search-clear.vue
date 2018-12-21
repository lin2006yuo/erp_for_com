<template>
    <el-button :type="isClear?'default':'primary'" @click.native="clear" size="mini">
        <slot>清空搜索</slot>
    </el-button>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            clear(){
                if(this.clearCb && this.clearCb instanceof Function){
                    this.clearCb.call(this.$vnode.context);
                }else{
                    this.default_clear_function();
                }
            },
            default_clear_function(){
                for(let i in this.form){
                    if(this.form.hasOwnProperty(i)){
                        let value = this.form[i];
                        switch (typeof value){
                            case 'string':
                                this.form[i] = '';
                                break;
                        }
                    }
                }
            }
        },
        computed:{
            isClear(){
                for(let i in this.form){
                    if(this.form.hasOwnProperty(i)){
                        let value = this.form[i];
                        switch (typeof value){
                            case 'string':
                                if(value !== '')return false;
                                break;
                        }
                    }
                }
                if(this.check){
                    return false;
                }
                return true;
            }
        },
        props:{
            form:{
                type:Object,
                default(){
                    return {

                    }
                }
            },
            check:{
                type:[Object,Boolean]
            },
            clearCb:{
                type:Function
            }
        },
        components:{

        },

    }
</script>
