<template>
    <el-row class="c-card-search">
        <search-card @search="search" :params="params" @init-params="$emit('clear')" :clears="clears" style="overflow: initial;">
            <div class="mb-mini el-row">
                <label class="inline">仓库：</label>
                <super-select v-model="params.warehouse_id"
                              @change="change_depot"
                              class="inline width-sm"
                              :options="warehouseList"
                              storageKey="globalWarehouse"></super-select>
                <!--<el-select v-model="params.warehouse_id" @change="change_depot" class="inline width-sm">-->
                    <!--<el-option-->
                            <!--v-for="(item, index) in warehouseList"-->
                            <!--:key="index"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <label class="inline ml-sm">入库类型：</label>
                <el-select class="inline width-xs" v-sf.type v-model="params.type">
                    <el-option v-for="item in inputList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <label class="inline ml-sm">状态：</label>
                <el-select class="inline width-xs" v-sf.status v-model="params.status">
                    <el-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </div>
                <label class="inline t-right">筛选条件：</label><el-select class="inline width-sm" v-sf.snType v-model="params.snType">
                    <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <order-input v-if="params.snType==='sku'" v-sf.snText
                             v-model="params.snText"
                             class="inline width-super"
                             @keydown="key_down"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
                <el-input class="inline width-super" v-else v-sf.snText @keyup.enter.native="search" v-model="params.snText" :placeholder="`请输入${changeLabel}...`"></el-input>
                <label class="ml-sm">日期：</label>
                <el-date-picker
                        class="inline date"
                        v-sf.date_b
                        v-model="params.date_b"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerStart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline date mr-sm"
                    v-sf.date_e
                    v-model="params.date_e"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {stock_warehouses,stock_types,stock_status} from '@/api/stock-in';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
        export default{
            data(){
                return{
                    inputList:[],
                    statusList:[],
                    warehouseList: [],
                    selectList:[
                        {label:"入库单号",value:"code"},
                        {label:"来源订单号",value:"source_number"},
                        {label:"SKU",value:"sku"},
                    ],
                    pickerStart:{
                        disabledDate:(time)=>{
                            if(this.params.date_e){
                                return time.getTime()>this.params.date_e;
                            }else{
                                return false;
                            }
                        }
                    },
                    pickerEnd:{
                        disabledDate:(time)=>{
                            if(this.params.date_b){
                                return time.getTime()<this.params.date_b;
                            }else{
                                return false;
                            }
                        }
                    },
                }
            },
            mounted(){
                this.get_types();
                this.get_status();
                this.init_warehouse()
            },
            computed:{
                changeLabel(){
                    let find = this.selectList.find(res=>{
                        return res.value === this.params.snType;
                    });
                    if(!!find){
                        return find.label;
                    }
                }
            },
            methods:{
                change_depot(){
                    this.search()
                },
                init_warehouse() {
                    //所有仓库除了fba
                    let params = {
                        sign: 'global'
                    };
                    this.$http(api_get_warehouse_default, params).then(res => {
                        this.warehouseList = res.map((item) => {
                            return {label: item.name, value: item.id};
                        });
                        this.params.warehouse_id = this.warehouseList[0].value;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                },
                key_down(){
                    this.search();
                },
                search(){
                    this.$emit("search");
                },
                get_types(){
                    this.$http(stock_types).then(res=>{
                        this.inputList = res;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code});
                    })
                },
                get_status(){
                    this.$http(stock_status).then(res=>{
                        this.statusList = res;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code});
                    });
                },
            },
            props:{
                params:{},
                clears:{},
            },
            components:{
                warehouse:require('@/api-components/warehouse.vue').default,
                searchCard:require('@/components/search-card.vue').default,
                orderInput:require("@/components/order-input.vue").default,
            }
        }
    </script>
