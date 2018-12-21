<template>
    <div class="turnover">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData"
                     @search="search"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="箱号类型："
                        class="inline"
                        @select="change_type"
                        :buttons="boxList">
                </label-buttons>
                <label-buttons
                        label="状态："
                        class="inline ml-sm"
                        @select="change_status"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <label-item label="周转箱号：">
                <order-input v-model="searchData.turnover_box_num"
                             class="inline width-super"
                             @keydown="search"
                             v-sf.turnover_box_num
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="拣货/上架单号：" class="ml-sm">
                <el-input v-model="searchData.picking_putaway_num"
                          placeholder="请输入拣货/上架单号"
                          v-sf.picking_putaway_num>
                </el-input>
            </label-item>
            <label-item label="集结区号：" class="ml-sm mr-sm">
                <el-input v-model="searchData.mass_zone_num"
                          placeholder="请输入集结区号"
                          v-sf.mass_zone_num>
                </el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
.turnover{
    .el-card{
        overflow: initial !important;
    }
}
</style>
<script>
    import {entrepot_picking} from '@/api/turnover-box'
    export default {
        data(){
            return {
                warehouse_id:2,
                searchData:{
                    type:'',
                    work_status:'',
                    turnover_box_num:'',
                    mass_zone_num:'',
                    picking_putaway_num:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                boxList:[
                    {label:'全部',value:''},
                    {label:'单品',value:1},
                    {label:'多品',value:2},
                    {label:'上架',value:3},
                ],
                statusList:[
                    {label:'全部',value:''},
                    {label:'空置',value:0},
                    {label:'拣货中',value:1},
                    {label:'集结中',value:2},
                    {label:'包装中',value:3},
                    {label:'分拣中',value:4}
                ]
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init_status_btn(){
                let cur = this.boxList;
                let cur2 = this.statusList;
                this.boxList = [];
                this.statusList = [];
                this.$nextTick(()=>{
                    this.boxList = cur;
                    this.statusList = cur2;
                })
            },
            init(){
                let searchData = window.clone(this.searchData);
                searchData.turnover_box_num = searchData.turnover_box_num.split('\n').filter(row => !!row).map(row => row.trim());
                // searchData.turnover_box_num = searchData.turnover_box_num.replace(/\n+/g,',').replace(/,$/,'')
                Object.keys(searchData).forEach(key => {
                    if(typeof searchData[key] === "string") {
                        searchData[key] = searchData[key].trim();
                    }
                });
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot() {
                this.init();
            },
            change_type(select, item){
                this.searchData.type = item.value;
                this.init();
            },
            change_status(select, item){
                this.searchData.work_status = item.value;
                this.init();
            },
            search(){
                this.init();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            orderInput:require('@/components/order-input.vue').default,
        },
    }
</script>
