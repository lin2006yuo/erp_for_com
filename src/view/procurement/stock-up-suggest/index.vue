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
    import {
        api_purchasing_cal,
        api_get_stocking_advice,
        } from '../../../api/purchasing'
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
                    status:4,
                    page:1,
                    pageSize:20,
                    warehouse_id:'',
                    transit_warehouse_id:'',
                    supplier_id:'',
                    snType:'stock_up_plan',
                    snText:'',
                    sku:'',
                    code:'',
                    sku_status:'',
                    userType:'purchaser',
                    userText:''
                },
                changeStatus:4,
                total:0,
                tableList:{},
                dataTable:[],
                loading:true,
                time:'',
                timer:null,
                buyer:[],
                skuTypeCount:0,
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            creat_cal(){
                this.$http(api_purchasing_cal,{purchaser_id:this.searchData.purchaser_id,warehouse_id:this.searchData.warehouse_id}).then(res=>{
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
                let data=window.clone(this.searchData);
                this.loading=true;
                this.dataTable=[];
                if (this.timer){
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(()=>{
                    this.$http(api_get_stocking_advice,data).then(res=>{
                        this.changeStatus = this.searchData.status;
                        this.total=res.count;
                        this.skuTypeCount = res.count;
                        this.loading=false;
                        this.firstLoading=false;
                        if(this.changeStatus===4||this.changeStatus===5){
                            this.tableList=res.data;
                            let tempArr =[];
                            if (res.data instanceof Array?res.data.length:res.data){
                                for(let key in res.data){
                                    res.data[key].forEach(data=>{
                                        this.$set(data,'isCheck',false);
                                        this.$set(data,'isDiable',false);
                                        this.$set(data,'select',false);
                                        this.$set(data,'clickData',false);
                                        this.$set(data,'isChange',false);
                                        // 为待开发审核添加字段
                                        if(this.changeStatus===5){
                                            this.$set(data,"transit_quantity",0);
                                            this.$set(data,"purchase_price",data.buying_price);
                                            this.$set(data,"purchase_num",data.sku_in_quantity);
                                            for (let item in data.available_list){
                                                this.$set(data.available_list[item],"new_quantity",0);
                                            }
                                        }
                                    });
                                    tempArr.push({supplier_id:key,supplier:res.data[key][0].supplier,num:res.data[key].length-this.distinct(res.data[key]),dataList:res.data[key]})
                                }
                                tempArr.forEach((data,index)=>{
                                    this.$set(data,'isChecks',false);
                                    if(!data.supplier){
                                        tempArr.splice(index,1);
                                        tempArr.unshift(data);
                                    }
                                });
                                this.dataTable=tempArr;
                            }
                        }else {   //不同维度处理不同的数据
                            if (res.data.length){
                                this.loading=false;
                                this.firstLoading=false;
                                res.data.forEach(data=>{
                                    this.$set(data,'isCheck',false);
                                    this.$set(data,'isDiable',false);
                                    this.$set(data,'select',false);
                                    this.$set(data,'clickData',false);
                                    this.$set(data,'isChange',false);
                                });
                                this.dataTable=res.data;
                            }
                        }
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                },500);

            },
            /*去重*/
            distinct(arr){
                arr=arr.map(row=>row.sku);
                let num=0;
                let obj = {};		//声明对象
                for(let i=0; i<arr.length; i++){
                    if(!obj[arr[i]]){	//如果不是对象里面的key，就说明元素没有重复
                        obj[arr[i]] = true;		//给该属性赋"真值"--------------(并存入对象中,方便进行下次比较)
                    }else {
                        num++
                    }
                }
                return num
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
            update_data() {
                this.init();
            }
        },
        components: {
            searchList:require('./search-list').default,
            tableList:require('./table-list').default
        }
    }
</script>
