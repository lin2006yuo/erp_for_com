<template>
    <div>
        <label :style="labelStyle">{{label}}</label>
        <div class="inline">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        computed:{
            labelStyle(){
                if(this.labelWidth){
                    return {
                        width:`${this.labelWidth}px`,
                        display:'inline-block',
                        textAlign:'right'
                    };
                }else{
                    return {}
                }
            }
        },
        props:{
            label:{
                required:true,
                type:String
            },
            labelWidth:{}
        },
        components:{

        }
    }
</script>