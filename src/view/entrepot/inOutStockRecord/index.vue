<template>
    <el-row class="p-index">
        <record-card :form="form" @search="search" @search-clear="search_clear"></record-card>
        <div class="card">
            <el-button size="mini" class="inline" type="primary" @click.native="add_entering_warehouse">添加入库</el-button>
            <el-button size="mini" class="inline" type="primary" @click.native="add_ex-warehouse">添加出库</el-button>
            <entering-warehouse v-model="enterDialog"></entering-warehouse>
            <table-date
                class="mt-xs"
                :table-data="tableData"
                @size-change="size_change"
                @current-change="current_change"
                @delete-list="delete_list"
                @look-up="look_up"
                @amend="amend"
                :isLoading="isLoading"
            ></table-date >
            <look-up v-model="lookUpDialog" :form="lookUpForm"></look-up>
        </div>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import recordCard from './record-card.vue';
    import enteringWarehouse from './entering-warehouse.vue';
    import tableDate from './data-list.vue';
    import lookUp from './look-up.vue';
    import {api_get,api_delete,api_look_up} from '../../../api/inoutstock-record';
    export default{
    	  page:{},
        refresh(){
    	  	this.form = {
            warehouse:1,
            warehouseList:[],
            type:0,
            typeValue:0,
            status:1,
            snType:"order_number",
            input:"",
            startT:"",
            endT:""
          };
    	  	this.init();
        },
        data(){
            return {
                form:{
                    warehouse:1,
                    warehouseList:[],
                    type:0,
                    typeValue:0,
                    status:1,
                    snType:"order_number",
                    input:"",
                    startT:"",
                    endT:""
                },
                enterDialog:false,
                tableData:{
                    count:0,
                    page:1,
                    pageSize:50,
                    total:0,
                    lists:[
                        {id:1,inOutNumber:"SOME-49490",inOutType:"采购入库",warehouse:"东莞仓",sourceNumber:"05767829M53978827",status:"待审",createTime:"2016-11-10 11:17",
                            detail:[
                                {id:11,sku:"YA1065M",name:"黑色露肩镂空圆领长袖修身T恤",color:"白色",size:"M",amount:"300",price:"12",remark:""}
                                ]
                        },
                        {id:2,inOutNumber:"SOME-49490",inOutType:"采购入库",warehouse:"东莞仓",sourceNumber:"05767829M53978827",status:"待审",createTime:"2016-11-10 11:17", detail:[
                                {id:12,sku:"YA1065M",name:"黑色露肩镂空圆领长袖修身T恤",color:"白色",size:"M",amount:"300",price:"12",remark:""}
                                ]
                        },
                        {id:3,inOutNumber:"SOME-49490",inOutType:"采购入库",warehouse:"东莞仓",sourceNumber:"05767829M53978827",status:"待审",createTime:"2016-11-10 11:17", detail:[
                                {id:13,sku:"YA1065M",name:"黑色露肩镂空圆领长袖修身T恤",color:"白色",size:"M",amount:"300",price:"12",remark:""}
                                ]
                        }
                    ]
                },
                parmas:{},
                lookUpDialog:false,
                lookUpForm:{},
                isLoading:true,
            }
        },
        created(){
            this.init();
        },
        watch:{

        },
        methods:{
            init(){
                this.isLoading = false;
                let params = {}
                this.form.warehouse&&(params.warehouse_id = this.form.warehouse);
                this.form.type&&(params.is_out = this.form.type);
                this.form.typeValue&&(params.type = this.form.typeValue);
                this.form.status&&(params.status = this.form.status);
                this.form.snType&&(params.snType = this.form.snType);
                this.form.input&&(params.snText = this.form.input);

                if(this.form.startT||this.form.endT){
                    let startT = new Date(this.form.startT);
                    let endT = new Date(this.form.endT);
                    this.form.startT = `${startT.getFullYear()}-${(startT.getMonth()+1)}-${startT.getDate()}`;
                    this.form.endT = `${endT.getFullYear()}-${(endT.getMonth()+1)}-${endT.getDate()}`;
                    params.date_b = this.form.startT;
                    params.date_e = this.form.endT;
                }

                this.$http(api_get,params).then(res=>{
                    this.tableData.count=res.count;
                    this.tableData.lists=res.data.map(row=>{
                        row.show = false;
                        row.selected = false;
                        return row;
                    });
                    this.isLoading = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                    this.isLoading = false;
                });
            },
            add_entering_warehouse(){
                this.enterDialog=true;
            },
            add_Output(){
                console.log("add_Output");
            },
//            -------------------------------------------   分页
            current_change(page){
                this.tableData.page=page;
                this.init();
            },
            size_change(size){
                this.tableData.pageSize=size;
                this.init();
            },
//           -------------------------------------------- 搜索
            search(){
//                this.parmas={
//                    page:this.tableData.page,
//                    pageSize:this.tableData.pageSize,
//                    stime:this.form.startT,
//                    etime:this.form.endT,
//                    warehouse_id:this.form.warehouse,
//                    snType:this.form.snType,
//                    snText:this.form.input,
//                    stockType:this.form.type,
//                    sonType:this.form.typeValue,
//                    status:this.form.status
//                }
                this.init();
            },
//            ------------------------------------------- 高级搜索
//            advanced_search(){
//                console.log('advanced_search')
//            },
//            -------------------------------------------  清空搜索
            search_clear(){
                this.form = {
                    warehouse:1,
                    type:0,
                    typeValue:0,
                    status:1,
                    snType:"order_number",
                    input:"",
                    startT:"",
                    endT:""
                };
                this.init();
            },
//            -------------------------------------------- table 查看
            look_up(id){
                console.log(`ID ${id}`);
                this.$http(api_look_up,id).then(res=>{
                    console.log(res);
                    this.lookUpDialog=true;
                    this.lookUpForm=res;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message || code});
                    return;
                })

            },
//            -------------------------------------------- table 修改
            amend(id){
                console.log(`ID ${id}`);
            },
//            ------------------------------------------- table 删除
            delete_list(index){
                let id=this.tableData.lists[index].id;
                this.$confirm('此操作将永久删除该数据, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message:`${res.message}` || res,
                        });
                        this.tableData.lists.splice(index,1);
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:`${code.message}` || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

        },
        components: {
            recordCard,
            enteringWarehouse,
            tableDate,
            lookUp
        }
    }
</script>
