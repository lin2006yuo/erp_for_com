<template>
    <page>
        <el-col :span="12">
            <left-div @push-data="pushData" ref="left"></left-div>
        </el-col>
        <el-col :span="12">
            <right-div class="ml-sm" ref="right_div" :table-data="tableData" :warehouse-id="warehouse_id"></right-div>
        </el-col>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.left.$refs.search_module.$refs.shipping_number.$refs.input.focus();
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-12-11',
                updateTime:'2017-12-11'
            },
        },
        data(){
            return {
                tableData:[],
                warehouse_id:''
            }
        },
        mounted(){

        },
        methods: {
            pushData(data){
                let flag = this.tableData.find(row=>{
                    return row.id === data.id;
                });
                if(!flag){
                    this.tableData.unshift(data);
                }
            },
        },
        computed: {},
        watch: {

        },
        props: {},
        components: {
            leftDiv:require('./left-div.vue').default,
            rightDiv:require('./right-div.vue').default
        },
    }
</script>
