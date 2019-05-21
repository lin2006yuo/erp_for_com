<template>
    <div class="c-type1">
        <div v-if="item in sourceData" :key="item.key">
            <el-checkbox v-model="checked" :label="item.key">{{item.title}}</el-checkbox>
            <div v-for="(it,index) in item.child" :key="it.key">
                <el-checkbox :label="it.key"
                             v-model="checked">{{it.title}}</el-checkbox>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                checked:false,
            }
        },
        watch:{
            sourceData(val){
                console.log(val,'val');
            },
        },
        props:{
            /*页面数据源
            * */
            sourceData:{
                required:true,
                type:Array
            }
        },
        components: {}
    }
</script>