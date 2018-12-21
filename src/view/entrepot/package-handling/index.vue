<template>
    <page>
        <el-col :span="12">
            <left-div @push-data="pushData" ref="left" :printer="printer"></left-div>
        </el-col>
        <el-col :span="12">
            <right-div class="ml-sm" ref="right_div" :table-data="tableData" @set-printer="setPrinter"></right-div>
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
                backEnd:'詹熏欣',
                createTime:'2017-12-01',
                updateTime:'2017-12-04'
            },
        },
        data(){
            return {
                headData:{},
                printer: '',
                tableData: [],
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){

            }
        },
        methods: {
            pushData(data){
                let flag = this.tableData.findIndex(row=>{
                    return row.package_id === data.package_id;
                });
                if(flag === -1){
                    this.tableData.unshift(data);
                } else {
                    this.tableData[flag] = data;
                    this.tableData = clone(this.tableData);
                }
            },
            setPrinter(value){
                this.printer = value;
            }
        },
        computed: {},
        watch: {
            param(val){
                if(window.objlength(val)!==0){

                }
            }
        },
        props: {},
        components: {
            leftDiv:require('./left-div.vue').default,
            rightDiv:require('./right-div.vue').default
        },
    }
</script>
