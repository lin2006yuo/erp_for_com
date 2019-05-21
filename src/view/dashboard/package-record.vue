<template>
    <ui-card>
        <span slot="header">
            <template v-for="(item,index) in headList">
                <span
                    :key = "index"
                    :class="['title',currentIndex===item.changeIndex?'title_underline':'no-underline','title']"
                    @click="change_module(item)">{{item.tabName}}</span>
                <span class="title" v-if="index!==(headList.length-1)">|</span>
            </template>
            <span v-if="currentIndex!==0" class="operate ml-sm" @click="targetTo">查看详情</span>
        </span>
        <component :is="currentComponent"
                   :currentIndex = "currentIndex"
                   :loading = "loading"
                   :head = "head"
                   :tableData= "tableData">
        </component>
    </ui-card>
</template>

<script>
    import {
        api_warehouse_list,
        api_warehouse_package,
        api_warehouse_package_unfilled,
        api_warehouse_package_shipped,
        api_warehouse_package_not_opened,
        api_warehouse_package_stock
    } from "@/api/dashborad"
    import tableHover from "./table-hover.vue"
    export default {
        name: "package-record",
        data(){
            return {
                currentIndex:0,
                headList:[
                    {changeIndex:0,tabName:"仓库统计",component:tableHover,action:function(){
                            this.loading = true;
                            this.head = [
                                {label:"仓库",key:"name",width:20},
                                {label:"未操作包裹",key:"unpacked_package",width:15},
                                {label:"缺货包裹",key:"stock_package",width:15},
                                {label:"未配货包裹",key:"delivery",width:15},
                                {label:"未符合生成拣货单",key:"not_conforming",width:15},
                                {label:"问题订单包裹",key:"orders_audit",width:15}
                            ];
                            this.$http(api_warehouse_package).then(res=>{
                                this.tableData = res.data;
                                this.loading = false;
                            }).catch(err=>{
                                this.$message({type:"error",message:err.message||err})
                            })
                        },
                    },
                    {changeIndex:1,tabName:"未发货记录",component:tableHover,action:async function(){
                            this.loading = true;
                            try{

                                let warehouseList = await this.getWarehouseList();
                                let res = await this.$http(api_warehouse_package_unfilled);
                                let head = warehouseList.data.map(val=>{
                                    return {
                                        label:val.name,
                                        key:val.id
                                    }
                                });
                                head.unshift({label:"统计时间",key:"date"});
                                head.push({label:"合计",key:0});
                                head.forEach(val=>{
                                    val.width = Math.round(100/(head.length))
                                });
                                let tableData = res.data.days.map(val=>{
                                    return {
                                        timestamp:val,
                                        date:window.datef("YYYY-MM-dd",val)
                                    }
                                });
                               tableData.forEach((val,index)=>{
                                   tableData[index] = Object.assign({},val,res.data.data[val.timestamp]);
                               });
                                this.head = head;
                                this.tableData = tableData.reverse();
                                this.loading = false;
                            }catch (err) {
                                this.$message({type:"error",message:err.message||err})
                            }

                        }
                    },
                    {changeIndex:2,tabName:"已发货记录",component:tableHover,action:async function(){
                        this.loading = true;
                        try{
                            let warehouseList = await this.getWarehouseList();
                            let res = await this.$http(api_warehouse_package_shipped);
                            let head = warehouseList.data.map(val=>{
                                return {
                                    label:val.name,
                                    key:val.id
                                }
                            });
                            head.unshift({label:"发货时间",key:"date"})
                            head.push({label:"合计",key:0})
                            head.forEach(val=>{
                                val.width = Math.round(100/(head.length))
                            });
                            let tableData = res.data.days.map(val=>{
                                return {
                                    timestamp:val,
                                    date:window.datef("YYYY-MM-dd",val)
                                }
                            });
                            tableData.forEach((val,index)=>{
                                tableData[index] = Object.assign({},val,res.data.data[val.timestamp]);
                            });
                            this.tableData = tableData.reverse();
                            this.head = head;
                            this.loading = false;
                        }catch(err){
                            this.$message({type:"error",message:err.message||err})
                        }

                        },
                    },
                    {changeIndex:3,tabName:"未拆包记录",component:tableHover,action:async function(){
                            this.loading = true;
                            try{
                                let warehouseList = await this.getWarehouseList();
                                let res = await this.$http(api_warehouse_package_not_opened);
                                let head = warehouseList.data.map(val=>{
                                    return {
                                        label:val.name,
                                        key:val.id
                                    }
                                });
                                head.unshift({label:"统计时间",key:"date"});
                                head.push({label:"合计",key:0});
                                head.forEach(val=>{
                                    val.width = Math.round(100/(head.length))
                                });
                                let tableData = res.data.days.map(val=>{
                                    return {
                                        timestamp:val,
                                        date:window.datef("YYYY-MM-dd",val)
                                    }
                                });
                                tableData.forEach((val,index)=>{
                                    tableData[index] = Object.assign({},val,res.data.data[val.timestamp]);
                                });
                                this.tableData = tableData.reverse();
                                this.head = head;
                                this.loading = false;
                            }catch(err){
                                this.$message({type:"error",message:err.message||err})
                            }
                        },
                    },
                    {changeIndex:4,tabName:"缺货记录",component:tableHover,action:async function(){
                            this.loading = true;
                            try{
                                let warehouseList = await this.getWarehouseList();
                                let res = await this.$http(api_warehouse_package_stock);
                                let head = warehouseList.data.map(val=>{
                                    return {
                                        label:val.name,
                                        key:val.id
                                    }
                                });
                                head.unshift({label:"统计时间",key:"date"});
                                head.push({label:"合计",key:0});
                                head.forEach(val=>{
                                    val.width = Math.round(100/(head.length))
                                });
                                let tableData = res.data.days.map(val=>{
                                    return {
                                        timestamp:val,
                                        date:window.datef("YYYY-MM-dd",val)
                                    }
                                });
                                tableData.forEach((val,index)=>{
                                    tableData[index] = Object.assign({},val,res.data.data[val.timestamp]);
                                });
                                this.tableData = tableData.reverse();
                                this.head = head;
                                this.loading = false;
                            }catch(err){
                                this.$message({type:"error",message:err.message||err})
                            }
                        }
                    }
                ],
                loading:true,
                head:[],
                tableData:[]
            }
        },
        computed:{
            currentComponent(){
                return this.headList[this.currentIndex].component
            }
        },
        created(){
            this.headList[this.currentIndex].action.call(this);

        },
        methods:{
            change_module(item){
                this.tableData = [];
                this.currentIndex = item.changeIndex;
                item.action.call(this);
            },
            getWarehouseList(){
                return this.$http(api_warehouse_list)
            },
            targetTo(){
                switch(this.currentIndex){
                    case 1:
                        this.$open("/report/unshipped");
                        break;
                    case 2:
                        this.$open("/report/shipped");
                        break;
                    case 3:
                        this.$open("/report/unpacked");
                        break;
                    case 4:
                        this.$open("/report/shortage");
                        break;
                }
            }
        },
        components:{
            uiCard: require('../../components/ui-card').default,
        }
    }
</script>

<style lang="stylus" scoped>
    .nearby-chat {
        width: 100%;
        height: 200px;
    }
    .title_underline{
        transition:all 0.2s;
        border-bottom-color: #00acac !important;
    }
    .no-underline{
        color: #b1b1b1;
    }
    .title{
        cursor:pointer;
        margin-left:3px;
    }
</style>
