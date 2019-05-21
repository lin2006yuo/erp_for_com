<template>
    <page>
        <div>
            <el-button  class="ml-sm mb-xs"
                        type="primary" 
                        size="mini" 
                        @click.native="add">添加
            </el-button>   
        </div> 

        <data-table :table-data="tableData"
                    @operation_history="operation_history">
                    
        </data-table>

        <operation-dialog   v-model="operationDialogVisible"
                            :dialog-data="dialogData"
                            :title="operationTitle"
                            :currency="currency"
                            @refresh="init">
        </operation-dialog>

        <operation-history  v-model="historyVisible"  
                            :data="historyData"
                            :title="historyTitle"
                            :currency="currency"
                            :page-info="historyPageInfo"
                            @history-page-change="history_page_change">
        </operation-history>

        <el-pagination  class="page-fixed"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        :current-page="pageInfo.page"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="pageInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageInfo.total">
        </el-pagination>   
    </page>
</template>

<script>
import {
    api_get_currency_select_list,
    api_get_transfer_fee,
    api_post_transfer_fee,
    api_get_transfer_fee_history
} from '@/api/transporting-charge.js'
export default {
    beforeMount(){
        this.get_currency();
        this.init();
    },
    data(){
        return{
            pageInfo:{
                page:1,
                pageSize:50,
                total:0
            },
            historyPageInfo:{
                page:1,
                pageSize:20,
                total:0
            },
            tableData:[],
            dialogData:{status:0},
            historyData:[],
            currency:[],
            operationDialogVisible:false,
            historyVisible:false,
            operationTitle:'',
            historyTitle:'',
            currentRow:{}
        }
    },
    methods:{
        init(){
            let params={pageSize:this.pageInfo.pageSize,page:this.pageInfo.page};
            this.$http(api_get_transfer_fee,params)
                .then(res=>{
                    console.log("res",res);
                    this.tableData=res.data;
                    this.pageInfo.total=res.count;
                })
                .catch(err=>{
                    console.log(err.message);
                })
        },
        get_currency(){
            this.$http(api_get_currency_select_list)
                .then(res=>{
                    console.log("获取币种:",res);
                    this.currency=res.data;
                })
                .catch(err=>{
                    console.log(err.message);
                })
        },
        add(){
            this.dialogData={status:0};
            this.operationTitle='添加仓库转运费';
            this.operationDialogVisible=true;
        },
        currentChange(val){
            this.pageInfo.page=val;
            this.init();
        },
        sizeChange(val){
            this.pageInfo.pageSize=val;
            this.init();
        },
        operation_history(row){
            this.currentRow=row;
            let params={
                    warehouse_id:row.warehouse_id,
                    carrier_id:row.carrier_id,
                    id:row.id,
                    page:this.historyPageInfo.page,
                    pageSize:this.historyPageInfo.pageSize
                };

            this.$http(api_get_transfer_fee_history,params)
                .then(res=>{
                    console.log("history",res);
                    this.historyData=res;
                    this.historyTitle='仓库转运费历史记录';
                    this.historyVisible=true;
                })
                .catch(error=>{
                    console.log(error.message);
                })
        },
        history_page_change(val){
            this.historyPageInfo.page=val;
            this.update_history();
        },
        update_history(){
            let params={
                warehouse_id:this.currentRow.warehouse_id,
                carrier_id:this.currentRow.carrier_id,
                id:this.currentRow.id,
                page:this.historyPageInfo.page,
                pageSize:this.historyPageInfo.pageSize
            }

            this.$http(api_get_transfer_fee_history,params)
                .then(res=>{
                    console.log("history",res);
                    this.historyData=res;
                })
                .catch(error=>{
                    console.log(error.message);
                })
        }
    },
    components:{
        dataTable:require('./data-table').default,
        operationDialog:require('./operation-dailog').default,
        operationHistory:require('./operation-history').default
    }      
}
</script>

<style scoped>

</style>
