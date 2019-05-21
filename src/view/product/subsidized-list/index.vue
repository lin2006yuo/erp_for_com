<template>
    <page>
        <search-list :searchData="searchData"  @refresh="init"></search-list>
        <el-row class="mt-md mb-md">
            <el-button type="primary" size="mini" @click="add">添加</el-button>
            <el-button type="primary" size="mini" @click="import_action">批量导入</el-button>
            <div class="inline">
                <permission tag="trendsSelect"
                            class="inline ml-xs mr-xs"
                            type="primary"
                            :route="apis.url_goods_discount_export"
                            :selects="partAllOptions"
                            @trigger="export_excel">
                </permission>
                <template v-if="searchData.status===0">
                    <permission tag="trendsSelect"
                                class="inline ml-xs mr-xs"
                                type="primary"
                                :route="apis.url_goods_discount_batch"
                                :selects="batchHandleOptions1"
                                @trigger="batch_action">
                    </permission>
                </template>
                <template v-if="searchData.status===2">
                    <permission tag="trendsSelect"
                                class="inline ml-xs mr-xs"
                                type="primary"
                                :route="apis.url_goods_discount_batch"
                                :selects="batchHandleOptions2"
                                @trigger="batch_action">
                    </permission>
                </template>
            </div>
        </el-row>
        <!--table-->
        <ui-table
            ref="table"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :body-height="41"
            :first-loading="firstLoading"
            :has-data="tableData.length>0"
            v-model="checkAll"
            @check="head_check"
            :heads="tableHead">
            <tbody>
                <template v-for="(item,index) in tableData">
                    <tr :key="index">
                        <td>
                            <el-checkbox v-model="item.check"></el-checkbox>
                        </td>
                        <td>{{item.warehouse}}</td>
                        <td>{{item.sku}}</td>
                        <td>{{item.inventory_price}}</td>
                        <td>{{item.last_purchase_price}}</td>
                        <td>{{item.new_price}}</td>
                        <td>{{item.discount_type===1?item.discount_value:'--'}}</td>
                        <td>{{item.discount_type===2?item.discount_value:'--'}}</td>
                        <td>{{item.discount_num}} / {{item.sell_num}}</td>
                        <td>{{item.valid_time}} / {{item.over_time}}</td>
                        <td>{{item.proposer}}</td>
                        <td>{{item.proposer_time}}</td>
                        <td>{{item.audit}}</td>
                        <td>{{item.audit_time}}</td>
                        <td>{{item.status|filterStatus}}</td>
                        <td>
                            <el-button type="text" @click="checkData(item)"> 查看 </el-button>
                            <template v-if="item.status === 0||item.status===2">
                                |<el-button type="text"  @click="handle(item)"> 处理 </el-button>
                            </template>
                        </td>
                    </tr>
                </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.page"
            :page-sizes="[10,50,100,200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <subsidized-sku v-model="subsidizedShow"
                        :title="title"
                        :flag="flag"
                        :param="param"
                        :form = "formData"
                        @refresh="init">
        </subsidized-sku>
        <import-excel v-model="showImport" @files-success="init"></import-excel>
        <page-dialog v-model="errorShow" :title="errorTitle" width="300px">
            <el-input type="textarea" v-model="errorMessage" placeholder="请输入原因,,,,,,"></el-input>
            <div slot="footer">
                <el-button size="mini" type="primary" @click="submit_error" :disabled="!errorMessage">提交</el-button>
                <el-button size="mini" @click="errorShow=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<script>
    import {
        api_goods_discount,
        api_goods_discount_read,
        url_goods_discount_batch,
        api_goods_discount_batch,
        url_goods_discount_export,
        api_goods_discount_export,

    } from '@/api/subsidized-list.js'
    import {downloadFile} from '@/lib/http-plus.js'
    export default {
        permission:{
            url_goods_discount_batch,
            url_goods_discount_export
        },
        data(){
            return {
                loading:false,
                firstLoading:false,
                searchData:{
                    status:"",
                    warehouse_id:'',
                    sku:'',
                    proposer:'',
                    snType:"proposer_time",
                    start_time:'',
                    end_time:'',
                    pageSize:10,
                    page:1
                },
                checkAll:false, // 全选按钮
                tableHead:[
                    {isCheck:true,size:35},
                    {label:'仓库',size:75},
                    {label:'SKU',width:9},
                    {label:"成本（CNY）",width:9},
                    {label:"最后一次采购价（CNY）",width:7},
                    {label:"最新报价（CNY）",width:9},
                    {label:"跌价金额（CNY）",width:9},
                    {label:"跌价比例(%)",width:9},
                    {label:"跌价产品总数/已卖出产品数",width:7},
                    {label:"有效时间",size:130},
                    {label:"申请人",width:5},
                    {label:"申请时间",size:150},
                    {label:"审核人",width:5},
                    {label:"审核时间",size:150},
                    {label:"状态",width:6},
                    {label:"操作",width:9}
                ],
                tableData:[],
                total:0,
                subsidizedShow:false,
                formData:{},
                title:"",
                /*
                * 1 添加
                * 2 查看（ 待审核/审核未通过/审核通过/作废/已结束跌价查看 ）
                * 3 待审核处理
                * 4 审核未通过处理
                * */
                flag:0,  //  1 新增  2 查看 3 待审核处理 4 审核未通过处理
                param:{},
                partAllOptions:[
                    {
                        name:"部分导出",action:function(item){
                            let data = {
                                ids:this.selectArr.map(val=>val.id),
                                export_type:2
                            };
                            if(this.selectArr.length>0){
                                this.batch_export_handle(data);
                            }else{
                                this.$message({type:"warning",message:"请先选择需要导出的数据"})
                            }
                        }
                    },
                    {
                        name:"全部导出",action:function(item){
                            let data = {
                                export_type:1,
                                status:this.searchData.status,
                                warehouse_id:this.searchData.warehouse_id,
                                sku:this.searchData.sku,
                                proposer:this.searchData.proposer,
                                snType:this.searchData.snType,
                                start_time:this.searchData.start_time,
                                end_time:this.searchData.end_time,
                            };
                            data.start_time && (data.start_time = window.datef("YYYY-MM-dd",data.start_time/1000));
                            data.end_time && (data.end_time = window.datef("YYYY-MM-dd",data.end_time/1000));
                            this.batch_export_handle(data);
                        }
                    }
                ],
                batchHandleOptions1:[
                    {
                        name:"批量审核通过",action:function(item){
                            this.batch_audit_handle({status:1});
                        }
                    },
                    {
                        name:"批量审核未通过",action:function(item){
                            if(this.selectArr.length){
                                this.errorShow = true;
                                this.errorTitle = "批量审核未通过原因";
                                this.errorMessage = "";
                            }

                        }
                    }
                ],
                batchHandleOptions2:[
                    {
                        name:"批量作废",action:function(item){
                            if(this.selectArr.length){
                                this.errorShow = true;
                                this.errorTitle = "批量作废的原因";
                                this.errorMessage = "";
                            }

                        }
                    },
                ],
                showImport:false,
                errorShow:false,
                errorTitle:"",
                errorMessage:""
            }
        },
        computed:{
            selectArr(){
                return this.tableData.filter(val=>val.check)
            }
        },
        created(){
            this.init();

        },
        methods:{
            head_check(val){
                this.tableData.forEach(item=>{
                    this.$set(item,"check",val);
                })
            },
            handleSizeChange(val){
                this.$set(this.searchData,'pageSize',val);
                this.init();
            },
            handleCurrentChange(val){
                this.$set(this.searchData,'page',val);
                this.init();
            },
            add(){
                this.subsidizedShow = true;
                this.title = "添加申请sku跌价流程";
                this.flag = 1;
                this.formData = {
                    warehouse_id:'',
                    sku:"",
                    sku_id:"",
                    inventory_price:"",
                    last_purchase_price:"",
                    new_price:"",
                    discount_type:1,
                    discount_value:"",
                    discount_num:"",
                    valid_time:"",
                    over_time:"",
                    remark:"",
                    goods_id:""
                }
            },
            import_action(){ //  批量导入
                this.showImport = true;
            },
            export_excel(val){
                val.action.call(this,val);
            },
            batch_export_handle(data){
                let _data = !!data?data:{};
                this.$http(api_goods_discount_export,_data).then(res=>{
                    downloadFile({
                        url:config.apiHost+'downloadFile/downExportFile',
                        get:{file_code:res.file_code},
                        fileName:res.file_name,
                        suffix:'.xlsx',
                    });
                    this.$message({type:"success",message:res.message||res});
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error});
                })
            },
            batch_action(val){
                if(this.selectArr.length>0){
                    val.action.call(this,val);
                }else{
                    this.$message({type:"warning",message:"当前没有勾选中相应选项"})
                }

            },
            batch_audit_handle(data){
                let _data = Object.assign(data,{
                    ids:this.selectArr.map(val=>val.id)
                });
                this.$http(api_goods_discount_batch,_data).then(res=>{
                    this.errorShow = false; // 批量审核不通过 窗口关闭
                    this.$message({type:"success",message:res.message||res})
                    this.init()
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                })
            },
            submit_error(){
                let data = {};
                switch(this.searchData.status){
                    case 0:
                        data = {
                            status:2,
                            remark:window.clone(this.errorMessage)
                        };
                        break;
                    case 2:
                        data = {
                            status:3,
                            remark:window.clone(this.errorMessage)
                        };
                        break;
                }
                this.batch_audit_handle(data);
            },
            checkData(item){    // 查看数据
                this.$http(api_goods_discount_read,item.id).then(res=>{
                    this.formData = {
                        warehouse_id:res.warehouse_id,
                        sku:res.sku,
                        sku_id:res.sku_id,
                        inventory_price:res.inventory_price,
                        last_purchase_price:res.last_purchase_price,
                        new_price:res.new_price,
                        discount_type:res.discount_type,
                        discount_value:res.discount_value,
                        discount_num:res.discount_num,
                        valid_time:res.valid_time,
                        over_time:res.over_time,
                        remark:res.remark,
                        log:res.log,
                        goods_id:res.goods_id
                    };
                    this.subsidizedShow = true;
                    this.flag = 2;
                    this.title = `查看SKU：${item.sku}调价详情`;
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                });
            },
            handle(item){   // 处理数据
                this.$http(api_goods_discount_read,item.id).then(res=>{
                    this.formData = {
                        warehouse_id:res.warehouse_id,
                        sku:res.sku,
                        sku_id:res.sku_id,
                        inventory_price:res.inventory_price,
                        last_purchase_price:res.last_purchase_price,
                        new_price:res.new_price,
                        discount_type:res.discount_type,
                        discount_value:res.discount_value,
                        discount_num:res.discount_num,
                        valid_time:res.valid_time,
                        over_time:res.over_time,
                        remark:res.remark,
                        log:res.log,
                        goods_id:res.goods_id
                    };
                    this.subsidizedShow = true;
                    switch(item.status){
                        case 0:
                            /*待审核处理*/
                            this.$set(this.param,"id",item.id);
                            this.flag = 3;
                            break;
                        case 2:
                            /*审核不通过处理*/
                            this.$set(this.param,"id",item.id);
                            this.flag = 4;
                            break;
                    }
                    this.title = `处理SKU：${item.sku}调价详情`;
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                });
            },
            init(){
                this.loading = true;
                let data = window.clone(this.searchData);
                data.start_time && (data.start_time = window.datef("YYYY-MM-dd",data.start_time/1000));
                data.end_time &&　(data.end_time = window.datef("YYYY-MM-dd",data.end_time/1000));
                data.sku = data.sku.trim();
                data.proposer = data.proposer.trim();
                this.$http(api_goods_discount,data).then(res=>{
                    this.loading = false;
                    res.data.forEach(val=>{
                        this.$set(val,"check",false);
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.pageSize = res.pageSize;
                    this.page = res.page;
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                })
            }
        },
        filters:{
            filterStatus(val){
                switch(val){
                    case 0:
                        return "待审核";
                    case 1:
                        return "审核通过";
                    case 2:
                        return "审核不通过";
                    case 3:
                        return "作废";
                    case 4:
                        return "已结束跌价";
                }
            }
        },
        watch:{
            'tableData':{
                deep:true,
                handler(val,oldVal){
                    if(val.length){
                        let find = val.find(row=>{
                            return !row.check
                        });
                        if(!!find){
                            this.$set(this,"checkAll",false);
                        }else{
                            this.$set(this,"checkAll",true)
                        }
                    }

                }
            }

        },
        components:{
            "search-list":require('./search-list.vue').default,
            uiTable:require("@/components/ui-table.vue").default,
            "subsidized-sku":require('./subsidized-sku.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            importExcel: require('./import-excel.vue').default,
        }
    }
</script>

<style lang="stylus" scoped>

</style>
