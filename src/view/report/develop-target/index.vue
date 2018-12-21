<template>
    <page class="p-index">
        <search-card :params="searchData"
                     @search="search"
                     :clears="clears">
            <label>部门：</label>
            <el-select v-model="searchData.department_id"
                       class="inline s-width-large"
                       default-first-option filterable clearable>
                <el-option
                        v-for="res in departmentList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <label class="ml-sm">月份：</label>
            <el-date-picker
                    class="inline mr-sm"
                    v-model="searchData.date"
                    type="month"
                    placeholder="选择月">
            </el-date-picker>
        </search-card>
        <permission tag="ElButton" @click.native="batch_export"
                    type="primary" size="mini" class="ml-sm mt-sm mb-sm"
                    :route="apis.url_export_monthly">批量导出</permission>
        <permission tag="ElButton" @click.native="recal_people"
                    type="primary" size="mini" class="ml-sm mt-sm mb-sm"
                    :route="apis.url_post_recal_people">重算部门人数</permission>
        <table-data :table-data="tableData"
                    :search-data="searchData"></table-data>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_develop_monthly_target,api_develop_export_monthly,api_post_recal_people,url_post_recal_people,url_export_monthly} from '@/api/target-configure';
    import {downloadFile} from '@/lib/http';
    export default{
        permission:{
            url_export_monthly,
            url_post_recal_people
        },
        data(){
            return{
                tableData:[],
                loading:false,
                searchData:{
                    department_id:'',
                    date:new Date(),
                },
                clears:{},
                departmentList:[],
            }
        },
        mounted(){
            this.init();
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
            batch_export(){
                this.$http(api_develop_export_monthly).then(res => {
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix: '.xls',
                    });
                    this.$message({type: "success", message: '导出成功' || res});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            recal_people(){
                this.$http(api_post_recal_people).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            search(){
                this.init();
            },
        },
        components:{
            tableData:require('./table-data').default,
            searchCard:require('@/components/search-card.vue').default,
        }
    }
</script>