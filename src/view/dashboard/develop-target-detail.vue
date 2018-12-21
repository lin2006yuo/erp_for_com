<template>
    <page-dialog v-model="dialog"
                 size="page" @open="open"
                 :title="`${curTitle}：${curDate}`">
        <table-data :table-data="tableData"
                    :search-data="searchData"></table-data>
        <div slot="footer">
            <el-button type="primary" size="mini"
                       class="inline" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_develop_monthly_target} from '@/api/target-configure';
    import {api_get_monthly_target} from '@/api/monthly-target';
    export default {
        data() {
            return {
                dialog:this.value,
                loading:false,
                tableData:[],
                searchData:{
                    department_id:'',
                    date:new Date(),
                },
                curTitle:'SPU开发月度目标进度'
            }
        },
        methods:{
            init(){
                if(!this.searchData.date)return this.$message({type:'warning',message:'请先选择月份！'});
                let date = new Date(this.searchData.date);
                let params = {
                    year:date.getFullYear(),
                    monthly:date.getMonth()+1,
                    department_id:this.searchData.department_id,
                    is_pid:0,
                    mode:1
                };
                this.loading = true;
                this.tableData = [];
                this.$http(api_develop_monthly_target,params).then(res => {
                    res.forEach(item=>{
                        this.$set(item,'isShow',false);
                        this.$set(item,'depth',0)
                    });
                    this.tableData = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.loading = false;
                })
            },
            edit(){
                let dateList = this.curDate.split("-");
                let params = {
                    year:dateList[0],
                    monthly:dateList[1],
                    info:1,
                };
                this.loading = true;
                this.$http(api_get_monthly_target,params).then(res => {
                    this.tableData = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.loading = false;
                })
            },
            open(){
                this.init();
            },
        },
        computed:{

        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            curDate:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            tableData:require('@/view/report/develop-target/table-data').default,
        }
    }
</script>