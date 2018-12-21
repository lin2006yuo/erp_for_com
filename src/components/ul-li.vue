<template>
    <el-row class="c-ul-li">
        <el-col :span="6" v-for="item in message" :key="item">
            <div class="inline">{{item}}</div>
        </el-col>
    </el-row>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default{
        data(){
            return {
            }
        },
        props:{
          message:{
              required:true,
              type:Array
          }
        },
        components: {}
    }
</script>