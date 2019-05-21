<template>
    <div class="c-modal">
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .c-modal{
        /*width:100%;*/
        /*height:100%;*/
        /*background-image:url(../assets/login2.jpg);*/
        /*background-size: cover;*/
    }
</style>
<script>

    export default{
        data(){
            return{
                show:this.value
            }
        },
        props:{
            value:{}
        },
        mounted(){
            let style = this.$el.style;
            console.log(style);
//            style.position = 'fixed';
//            style.top = 0;
//            style.left = 0;
//            style.width = '100%';
//            style.height = '100%';
//            style.backgroundColor = '#fff';
//            style.zIndex = "1001";
        },
        components:{

        }
    }
</script>