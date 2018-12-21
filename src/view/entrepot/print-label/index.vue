<template>
    <page>
        <el-col :span="14">
            <left-div @push-data="pushData" ref="left"></left-div>
        </el-col>
        <el-col :span="10">
            <right-div class="ml-sm" ref="right_div"></right-div>
        </el-col>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.left.$refs.search_module.$refs.number.$refs.input.focus();
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'詹熏欣',
                createTime:'2018-2-23',
                updateTime:'2018-2-23'
            },
        },
        data(){
            return {

            }
        },
        mounted(){},
        methods: {
            pushData(data){
               this.$refs.right_div.tableData.unshift(data);
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            leftDiv:require('./left-div.vue').default,
            rightDiv:require('./right-div.vue').default
        },
    }
</script>
