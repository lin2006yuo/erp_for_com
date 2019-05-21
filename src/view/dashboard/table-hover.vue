<template>
    <div class="tableHover-wrap">
        <ui-table
            ref="table"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :body-height="75"
            :has-data="tableData.length>0"
            :heads="head">
            <template v-for="row in tableData">
                <tr class="bg-color">
                    <template v-for="item in head">
                        <td v-if="currentIndex===0">
                            <template v-if="row.id>0&&item.key==='unpacked_package'">
                                <el-popover
                                    placement="bottom"
                                    width="175"
                                    trigger="hover"
                                    @show="getSubTable(row,item)">
                                    <div class="sub-table-wrap" v-loading="sub_loading">
                                        <ul>
                                            <li v-for="(it,index) in sub_tableData">
                                                <div>{{it.label | formatFont}}</div>
                                                <div>{{it.data | formatFont}}</div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div slot="reference" class="f-color">{{row[item.key] | formatFont}}</div>
                                </el-popover>
                            </template>
                            <span v-else>{{row[item.key] | formatFont}}</span>
                        </td>
                        <td v-if="currentIndex===1||currentIndex===2||currentIndex===4">
                            <span v-if="
                            currentIndex===1&&(item.key==='date'||item.key===0)||
                            currentIndex===2&&(item.key==='date'||item.key===0)||
                            currentIndex===4&&(item.key==='date'||item.key===0)">{{row[item.key] | formatFont}}</span>
                            <template v-else>
                                <el-popover
                                    placement="bottom"
                                    width="175"
                                    offset="-5"
                                    trigger="hover"
                                    @show="getSubTable(row,item)">
                                    <div class="sub-table-wrap">
                                        <ul>
                                            <li v-for="(it,index) in sub_tableData">
                                                <div>{{it.label | formatFont}}</div>
                                                <div>{{it.data | formatFont}}</div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div slot="reference" class="f-color">{{row[item.key] | formatFont}}</div>
                                </el-popover>
                            </template>
                        </td>
                        <td v-if="currentIndex===3">
                            <span>{{row[item.key] | formatFont}}</span>
                        </td>
                    </template>
                </tr>
            </template>
        </ui-table>
        <div class="mt-lg">
            <span v-if="currentIndex===1">注：以上统计为最近七天的每日未发货包裹总数！</span>
            <span v-if="currentIndex===2">注：以上统计为最近七天的每日已发货包裹总数！</span>
            <span v-if="currentIndex===3">注：以上统计为最近七天的每日未拆包包裹总数！</span>
            <span v-if="currentIndex===4">注：以上统计为最近七天的每日缺货包裹总数！</span>
        </div>
    </div>
</template>

<script>
    import {
        api_warehouse_package_detail,
        api_warehouse_package_unfilled_detail,
        api_warehouse_package_shipped_detail,
        api_warehouse_package_stock_details
    } from "@/api/dashborad"
    export default {
        name: "table-hover",
        data(){
            return{
                sub_loading:false,
                sub_tableData:[],
            }
        },
        computed:{},
        methods:{
            getSubTable(row,item){
                switch(this.currentIndex){
                    case 0:
                        this.subTableData(row,item);
                        break;
                    case 1:
                        this.subTableData1(row,item);
                        break;
                    case 2:
                        this.subTableData2(row,item);
                        break;
                    case 4:
                        this.subTableData4(row,item);
                        break;
                }
            },
            async subTableData(row,item){
                this.sub_loading = true;
                try{
                    let res = await this.$http(api_warehouse_package_detail,{warehouse_id:row.id});
                    let tableData = [];
                    Object.keys(res.data).forEach(val=>{
                        tableData.push({
                            key:val,
                            data:res.data[val],
                            label:(()=>{
                                switch(val){
                                    case "package_not_collection":
                                        return "未集包包裹";
                                        break;
                                    case "sum":
                                        return "合计";
                                        break;
                                    case "wait_for_make_picking":
                                        return "未生成拣货";
                                        break;
                                    case "wait_for_packing":
                                        return "未包装包裹";
                                        break;
                                }
                            })()
                        })
                    });
                    this.sub_tableData = tableData;
                    this.sub_loading = false;
                }catch(err){
                    this.$message({type:"error",message:err.message||err})
                }
            },
            async subTableData1(row,item){
                this.sub_loading = true;
                try{
                    let res = await this.$http(api_warehouse_package_unfilled_detail,{
                        warehouse_id:item.key,
                        dateline:row.date
                    });
                    let tableData = [];
                    Object.keys(res.data).forEach(val=>{
                        tableData.push({
                            label:res.data[val].title,
                            data:res.data[val].qty
                        })
                    })
                    this.sub_tableData = tableData;
                    this.sub_loading =  false;
                }catch(err){
                    this.$message({type:"error",message:err.message||err});
                }
            },
            async subTableData2(row,item){
                this.sub_loading = true;
                try{
                    let res = await this.$http(api_warehouse_package_shipped_detail,{
                        warehouse_id:item.key,
                        dateline:row.date
                    });
                    let tableData = [];
                    Object.keys(res.data).forEach(val=>{
                        tableData.push({
                            label:res.data[val].title,
                            data:res.data[val].qty
                        })
                    });
                    this.sub_tableData = tableData;
                    this.sub_loading =  false;
                }catch(err){
                    this.$message({type:"error",message:err.message||err});
                }
            },
            async subTableData4(row,item){
                this.sub_loading = false;
                try{
                    let res = await this.$http(api_warehouse_package_stock_details,{
                        warehouse_id:item.key,
                        dateline:row.date
                    });
                    let tableData = [];
                    Object.keys(res.data).forEach(val=>{
                        tableData.push({
                            label:res.data[val].title,
                            data:res.data[val].qty
                        })
                    });
                    this.sub_tableData = tableData;
                    this.sub_loading =  false;
                }catch(err){
                    this.$message({type:"error",message:err.message||err});
                }
            },
        },
        filters:{
            formatFont(val){
                if( typeof (+val) === "number") {
                    return  String(val).replace(/(?!^)(?=(\d{3})+$)/g,",")
                }else{
                    return val;
                }
            }
        },
        props:{
            currentIndex:{
                type:Number,
                required:true
            },
            loading:{},
            head:{},
            tableData:{}
        },
        watch:{

        }
    }
</script>

<style lang="stylus" scoped>
    .tableHover-wrap{
        width:100%;
        height:290px;
    }
    .sub-table-wrap{
        width:100%;
        /*height:250px;*/
        max-height:250px;
        box-sizing:border-box;
        overflow-y:scroll
        ul{
            width:100%;
            height:100%;
            box-sizing:border-box;
            li{
                width:100%;
                height:24px;
                border-top:1px solid #ddd;
                border-left:1px solid #ddd;
                box-sizing:border-box;
                div{
                    float:left;
                    width:calc(50% - 2px);
                    height:100%;
                    border-right:1px solid #ddd;
                    border-bottom:1px solid #ddd;
                    text-align: center;
                    line-height:24px;
                }
            }
        }
    }
    .ui-table-head{
        background-color:#EFF2F7;
    }
    .c-ui-table-important{
        box-shadow:none;
    }
    >>>.c-ui-table-important .template.secTable{
        border-left:1px solid #ddd !important;

    }
    >>>.c-ui-table-important .ui-table-body{
        border-bottom:none !important;
        border-right:none !important;
    }
    .f-color{
        color: #69f;
        cursor: pointer;
    }
    .bg-color:hover{
        background-color:#EAF0F7;
    }
</style>
