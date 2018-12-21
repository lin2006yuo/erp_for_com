<template>
    <el-col :span="span" class="drop-item">
        <slot>111</slot>
    </el-col>
</template>
<style lang="stylus">
    .drop-item{
        user-drag: element;
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        mounted(){

        },
        props:{
            span:{
                default:24
            }
        },
        components: {}
    }
</script>
