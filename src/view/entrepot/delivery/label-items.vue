<template>
    <el-col :span="24">
        <label>{{label}}</label>
        <div class="inline">
            <slot></slot>
        </div>
    </el-col>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{

            }
        },
        props:{
            label:{
                required:true,
                type:String
            }
        },
        components:{

        }
    }
</script>