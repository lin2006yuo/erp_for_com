<template>
    <el-card class="card-component">
        <div class="close-icon el-icon-close" @click="close_cur"></div>
        <div class="mt-sm">
            <slot></slot>
        </div>
    </el-card>
</template>
<style lang="stylus">
    .card-component{
        position:relative;
        .close-icon{
            position:absolute;
            top:10px;
            right:10px;
            width:20px;
            height:20px;
        }
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        methods:{
            close_cur(){
                this.$emit('close-cur');
            },
        },
        components:{

        }
    }
</script>