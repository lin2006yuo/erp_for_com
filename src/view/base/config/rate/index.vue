<template>
    <page class="p-index">
            <permission
                    class="mt-xs ml-sm"
                    tag="ElButton"
                    :route="apis.url_add"
                    type="primary"
                    @click="add"
                    size="mini">添加</permission>
            <permission
                    tag="requestButton"
                    :route="apis.url_update_official_rate"
                    :request="update_official_rate">更新官方汇率</permission>
            <permission
                    tag="requestButton"
                    :route="apis.url_sort"
                    v-if="isDrag"
                    :request="save">保存</permission>
            <data-table
                    @page="page"
                    @page-size="page_size"
                    :table-data="tableData"
                    :loading="loading"
                    @draggable-change="draggable_change"
            ></data-table>
            <!--添加的弹出框-->
            <add-dialog v-model="showDialog" @update="update"></add-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import dataTable from './data-table.vue';
import AddDialog from './add-dialog.vue';
import {api_get,api_currency,api_update_official_rate,api_sort} from '../../../../api/rate';
import {url_add,url_update_official_rate,url_sort} from '../../../../api/rate';
    export default{
        permission:{
            url_add,
            url_update_official_rate,
            url_sort
        },
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return {
                loading:true,
                showDialog:false,
                currency:[],
                tableData:{
                    page:1,
                    pageSize:50,
                    total:0,
                    lists:[
                        {code:"CNY",sign:"¥",name:"人民币",official_rate:1,myself_rate:1,isMain:"是",last_update_time:2342142453},
                    ]
                },
                isDrag:false,
                sortList:[],
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            draggable_change(val){
                this.isDrag = true;
                this.sortList = val;
            },
            save(){
                return this.$http(api_sort,{sorts:this.sortList}).then(res=>{
                    this.init();
                    this.$message({type: "success", message: res.message || res})
                    this.isDrag = false;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            add(){
                this.showDialog=true;
            },
            update(){
                this.init();
            },
            page(page){
                this.tableData.page = page;
                this.init();
            },
            page_size(pageSize){
                this.tableData.pageSize = pageSize;
                this.init();
            },
            init(){
                let params = {
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                };
                this.loading=true;
                this.$http(api_get, params).then(res=>{
                    this.loading=false;
                    this.tableData.lists = res.data.map(row=>{
                        row.main = row.main ? '是' : '';
                        return row;
                    });
                    this.tableData.page = parseInt(res.page);
                    this.tableData.pageSize = parseInt(res.pageSize);
                    this.tableData.total = parseInt(res.count);
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                });
            },
            update_official_rate(){
                return this.$http(api_update_official_rate).then(res=>{
                    this.init();
                    this.$message({
                        type:'success',
                        message:'官方汇率更新成功！'
                    })
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
        },
        components: {
            dataTable,
            AddDialog,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
