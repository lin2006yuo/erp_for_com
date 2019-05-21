<template>
    <el-row class="c-card-search">
        <search-card @search="search" @init-params="$emit('clear')" :params="paramsData" :clears="clears" style="overflow: initial;">
            <el-row class="mb-mini">
                <label class="inline">仓库：</label>
                <super-select v-model="paramsData.warehouse_id"
                              @change="change_depot"
                              class="inline width-sm"
                              :options="warehouseList"
                              storageKey="globalWarehouse"></super-select>
                <!--<el-select v-model="paramsData.warehouse_id" @change="change_depot" class="inline width-sm">-->
                    <!--<el-option-->
                            <!--v-for="(item, index) in warehouseList"-->
                            <!--:key="index"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <label class="inline ml-sm">出库类型：</label>
                <el-select class="inline width-xs" v-sf.out_type v-model="paramsData.out_type">
                    <el-option v-for="item in outputList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <label class="inline ml-sm">状态：</label>
                <el-select class="inline width-xs" v-sf.status v-model="paramsData.status">
                    <el-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-row>
                <label class="inline t-right">筛选条件：</label><el-select class="inline width-sm" v-sf.snType v-model="paramsData.snType">
                    <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <order-input v-if="paramsData.snType==='sku'" v-sf.snText
                             v-model="paramsData.snText"
                             class="inline width-super"
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
                <el-input class="inline width-super" v-else v-sf.snText v-model="paramsData.snText" @keyup.enter.native="search" :placeholder="`请输入${changeLabel}...`"></el-input>
                <label class="ml-sm">日期：</label>
                <el-date-picker
                        class="inline date"
                        v-sf.date_b
                        v-model="paramsData.date_b"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerStart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline date mr-sm"
                    v-sf.date_e
                    v-model="paramsData.date_e"
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
    import {stock_warehouses,stock_types,stock_status} from '@/api/stock-out';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
        export default{
            data(){
                return{
                    paramsData:{
                        warehouse_id:'',
                        status:-1,
                        out_type:0,
                        snType:"code",
                        snText:"",
                        date_b:(Date.now()-(7*24*60*60*1000)),
                        date_e:Date.now(),
                    },
                    clears:{
                        warehouse_id:2,
                        status:-1,
                        out_type:0,
                        snType:"code",
                    },
                    warehouseList:[],
                    outputList:[],
                    statusList:[],
                    selectList:[
                        {label:"出库单号",value:"code"},
                        {label:"订单号",value:"order_number"},
                        {label:"来源订单号",value:"source_number"},
                        {label:"SKU",value:"sku"},
                    ],
                    pickerStart:{
                        disabledDate:(time)=>{
                            if(this.paramsData.date_e){
                                return time.getTime()> this.paramsData.date_e;
                            }else{
                                return false;
                            }
                        }
                    },
                    pickerEnd:{
                        disabledDate:(time)=>{
                            if(this.paramsData.date_b){
                                return time.getTime()< this.paramsData.date_b;
                            }else{
                                return false;
                            }
                        }
                    },

                }
            },
            created(){
                this.get_types();
                this.get_status();
                this.init_warehouse()
            },
            methods:{
                search(){
                    let date_b = '';
                    if(this.paramsData.date_b instanceof Date){
                        date_b = this.paramsData.date_b.getStartDaySTime();
                    }else if(this.paramsData.date_b){
                        date_b = new Date(datef('YYYY-MM-dd', this.paramsData.date_b/1000))/1000-8*60*60;
                    }else{
                        date_b = ''
                    }
                    let date_e = '';
                    if(this.paramsData.date_e instanceof Date){
                        date_e = this.paramsData.date_e.getEndDaySTime();
                    }else if(this.paramsData.date_e){
                        date_e = new Date(datef('YYYY-MM-dd', this.paramsData.date_e/1000))/1000+16*60*60;
                    }else{
                        date_e = ''
                    }
                    let conds = {
                        warehouse_id:this.paramsData.warehouse_id,
                        status:this.paramsData.status,
                        snType:this.paramsData.snType,
                        snText:this.paramsData.snText,
                        type:this.paramsData.out_type,
                        btime:date_b,
                        etime:date_e,
                    };
                    this.$emit("search", conds)
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
                        this.paramsData.warehouse_id = this.warehouseList[0].value;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                },
                change_depot(){
                    this.search()
                },
                get_types(){
                    this.$http(stock_types).then(res=>{
                        this.outputList = res;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code});
                    })
                },
                get_status(){
                    this.$http(stock_status).then(res=>{
//                        this.status = res[0].value;
                        this.statusList = res;
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code});
                    });
                },
            },
            computed:{
                check(){
                    if(this.paramsData.snText){
                        return true;
                    }
                    if(this.paramsData.date_b){
                        return true;
                    }
                    if(this.paramsData.date_e){
                        return true;
                    }
                    return false;
                },
                changeLabel(){
                	let find = this.selectList.find(res=>{
                		return res.value === this.paramsData.snType;
                    });
                	if(!!find){
                		return find.label;
                    }
                }
            },
            watch:{
                warehouse_id(){
                    this.search();
                },
                status(){
                    this.search();
                },
                out_type(){
                    this.search();
                }
            },
            components:{
                warehouse:require('@/api-components/warehouse.vue').default,
                clear:require('@/components/search-clear.vue').default,
                searchCard:require('@/components/search-card.vue').default,
                orderInput:require("@/components/order-input.vue").default,
            }
        }
    </script>
