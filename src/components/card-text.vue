<template>
    <el-row class="c-card-text">
        <div class="text-box">
            <span>{{text.name}}</span>:
            <span>{{text.value}}</span>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .c-card-text{
        .text-box{
            box-sizing:border-box;
            width:340px;
            span{
                font-size: 1.25rem;
            }
        }

    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        props:{
            text:{
                required:true,
                type:Object
            }
        },
        components: {}
    }
</script>

