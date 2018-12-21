<template>
    <div class="box-area">
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .box-area{
       /* border:1px solid #c9c9c9;*/
        border-radius: 3px;
        padding:2px;
        margin-right:2px;
        &:last-of-type{
            margin-right:0;
        }
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        components:{

        }
    }
</script>