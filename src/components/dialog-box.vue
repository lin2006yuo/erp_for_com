<template>
    <div class="dialog-box">
        <slot></slot>
    </div>
</template>
<style lang="stylus" scoped>
    .dialog-box{
        position: absolute;
        top:30%;
        left:40%;
        width: 300px;
        height:200px;
        text-align: center;
        font-size:128px;
        line-height:200px;
        background-color: rgba(149, 126, 50, 0.31);
        color: #951825;
    }
</style>
<script>
    export default{
        data(){
            return{
            }
        },
        mounted(){
        },
        computed:{
        },
        components:{

        }
    }
</script>