<template>
    <page class="p-index">
        <search-list
            :search-data="searchData"
            @search_list="search_list"></search-list>
        <table-list ref="lists"
                    :change-status="changeStatus"
                    @creat-cal="creat_cal"
                    @update-data="update_data"
                    :data-table="dataTable"
                    @sort-click="sort_click"
                    :time="time"
                    :first-loading="firstLoading"
                    :search-data="searchData"
                    :loading="loading"></table-list>
        <div class="ml-sm purchase-proposal-total-sku">{{`共${skuTypeCount}条SKU`}}</div>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=searchData.page
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>

    </page>
</template>
<style lang="stylus">
    .p-index{
        .btn{
            margin:5px  0;
        }
        .purchase-proposal-total-sku{
            color: #475669
            box-sizing: border-box;
            width: -moz-calc(100% - 182px);
            width: -webkit-calc(100% - 182px);
            position: fixed;
            background: #fff;
            text-align: right;
            padding-bottom: 3px;
            padding-right:20px;
            z-index: 1000;
            bottom: 5px;
            width: auto;
        }
    }

</style>
<script>
    import {purchasing_list,api_purchasing_cal,api_purchasing_caltime,getUser,api_get_user_proposal_staffs} from '../../../api/purchasing'

    export default{
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'杨伟权;谭斌',
                createTime:'2018-11-28',
                updateTime:'2018-11-30'
            },
            beforeClose(){
                let show = this.$refs.lists.show;
                if(show){
                    return true
                }else {
                    return this.$confirm(`您的修改未保存,确定离开此页面吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code=>{
                        return false
                    })
                }
            }
        },
        refresh(){
            this.$refs.lists.show = true;
            delete this.searchData.sort_field;
            delete this.searchData.sort_type;
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                searchData:{
                    daily_sale_start:'',
                    daily_sale_end:'',
                    purchase_price_start:'',
                    purchase_price_end:'',
                    snType:'SKU',
                    snText:'',
                    sku:'',
                    batchText:'',
                    warehouse_id:'',
                    supplier_id:"",
                    purchaser_id:[],
                    sku_status:[],
                    status:0,
                    page:1,
                    pageSize:20,
                    po_create_uid:"",
                    delivery_time:"",
                    available_stock_qty:"",
                    intransit_stock_qty:"",
                    daily_sale:"",
                    due_quantity:"",
                    inventory_balance:"",
                    proposal_qty:"",
                    purchase_qty:"",
                },
                changeStatus:0,
                total:0,
                tableList:{},
                dataTable:[],
                loading:true,
                time:'',
                buyer:[],
                skuTypeCount:0
            }
        },
        methods: {
            creat_cal(){
                this.$http(api_purchasing_cal,{purchaser_id:this.searchData.purchaser_id.join(','),warehouse_id:this.searchData.warehouse_id}).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    this.init();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_purchasing_cal',false);
                    },200);
                });

            },
            sort_click(val){
                switch(val.label){
                    case "安全交期":
                        this.searchData.sort_field = 'delivery_time';
                        break;
                    case "可用库存":
                        this.searchData.sort_field = 'available_stock_qty';
                        break;
                    case "在途库存":
                        this.searchData.sort_field = 'intransit_stock_qty';
                        break;
                    case "缺货数量":
                        this.searchData.sort_field = 'due_quantity';
                        break;
                    case "日均销量":
                        this.searchData.sort_field = 'daily_sale';
                        break;
                    case "建议采购":
                        this.searchData.sort_field = 'proposal_qty';
                        break;
                    case "采购数量":
                        this.searchData.sort_field = 'purchase_qty';
                        break;
                }
                this.searchData.sort_type = val.order;
                this.init();
            },
            init(){
                let data = window.clone(this.searchData);
                data.purchaser_id = data.purchaser_id.join(',');
                data.sku_status = data.sku_status.join(',');
                if(data.batchText){
                    let cur = data.batchText.trim().replace(new RegExp(' ','gm'),'\n').trim().split('\n').map(row=>row.trim()).filter(row=>row!=='');
                    data.sku = cur.map(row=>{
                        return row.trim();
                    });
                }
                this.$delete(data,'batchText');
                this.loading=true;
                this.dataTable=[];
                this.$http(purchasing_list,data).then(res=>{
                    this.changeStatus = this.searchData.status;
                    this.total=res.count;
                    this.skuTypeCount = res.skuTypeCount;
                    this.loading=false;
                    this.firstLoading=false;
                    this.tableList=res.data;
                    let tempArr =[];
                    for(let key in res.data){
                        res.data[key].forEach(data=>{
                            this.$set(data,'isCheck',false);
                            this.$set(data,'isDiable',false);
                            this.$set(data,'select',false);
                            this.$set(data,'clickData',false);
                            this.$set(data,'isChange',false);
                            data.purchase_price=data.purchase_price.substring(0,data.purchase_price.indexOf(".")+4);//--保留两位小数
                        });
                        tempArr.push({supplier_id:key,supplier:res.data[key][0].supplier,num:res.data[key].length,dataList:res.data[key]});
                    }
                    tempArr.forEach((data,index)=>{
                        this.$set(data,'isChecks',false);
                        if(!data.supplier){
                            tempArr.splice(index,1);
                            tempArr.unshift(data);
                        }
                    });
                    this.dataTable=tempArr;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            search_list(){
                this.init();
            },
            handleSizeChange(val){
                this.searchData.pageSize=val;
                this.init();
            },
            handleCurrentChange(val){
                this.searchData.page=val;
                this.init();
            },
            update_data(){
                this.init();
            }
        },
        components: {
            searchList:require('./search-list').default,
            tableList:require('./table-list').default
        }
    }
</script>
